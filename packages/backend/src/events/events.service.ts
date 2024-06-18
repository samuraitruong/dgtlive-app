import configuration from 'src/config/configuration';
import * as moment from 'moment';
import {
  LiveChessTournament,
  GameEventResponse,
  Tournament,
  Pair,
  mapGameResult,
} from 'library';
import { LoadGameDto } from './dto/game-event.dto';
import { Cache } from '@nestjs/cache-manager';
import { EventServiceOptions } from './dto/event-option';
import { TournamentDataService } from '../db/tournament-data.service';
import { GameDataService } from 'src/db/game-data.service';
import { FideService } from 'src/fide/fide.service';

export class EventsService {
  public tournamentId: string;

  readonly game: LiveChessTournament;

  constructor(
    private cacheManager: Cache,
    private dataService: TournamentDataService,
    private gameDataService: GameDataService,
    private fideService: FideService,
    private options: EventServiceOptions,
  ) {
    this.tournamentId = configuration().game.juniorTournamentId;
    this.game = new LiveChessTournament(
      configuration().game.juniorTournamentId,
    );
  }

  async setGameId(tournamentId: string) {
    const dgtLiveChess = new LiveChessTournament(tournamentId);
    const verify = dgtLiveChess.fetchTournament();
    if (verify) {
      console.log('Overwritting game id to ', tournamentId);
      this.tournamentId = tournamentId;
      this.game.setGame(tournamentId);
      await this.hello(true);
    }
    return verify;
  }

  async loadGame(game: LoadGameDto): Promise<GameEventResponse> {
    const cacheKey = `${this.tournamentId}-${game.round}-${game.game}`;
    const tour = await this.cacheManager.get<GameEventResponse>(cacheKey);
    if (tour) {
      return tour;
    }
    const { moves, live, startedAt, result } = await this.game.fetchGame(
      game.round,
      game.game,
    );
    let previousMovedAt = startedAt;
    let totalTIme = 0;
    const extractTime = (t: string) => {
      if (!t) {
        return { time: 0, moveTime: 0 };
      }
      const [time, spent] = t.split('+');

      previousMovedAt = previousMovedAt + (+spent || 0) * 1000;
      totalTIme += +spent || 0;

      const item = {
        time: +time,
        moveTime: +spent || 0,
        movedAt: previousMovedAt,
      };
      return item;
    };
    let cacheData: any = (await this.cacheManager.get(
      this.tournamentId,
    )) as Tournament;
    // if cache not found, then need to get data again
    if (cacheData === null || cacheData === undefined) {
      cacheData = await this.hello();
    }
    const pair = cacheData.rounds[game.round - 1].pairs[game.game - 1] as Pair;

    const t: GameEventResponse = {
      result: mapGameResult(result),
      pair,
      isLive: live,
      ...game,
      moves: moves.map((x) => ({
        ...extractTime(x[2]),
        san: x[0],
        fen: x[1],
        arrow: [x[3], x[4]],
      })),
    };
    console.log(
      'Total time spend until now',
      totalTIme,
      previousMovedAt - startedAt,
    );
    //save the game to database
    this.gameDataService.upsert({ ...t, liveChessId: this.tournamentId });
    if (t.moves.length > 4) {
      const delayMoves = this.options.delayedMoves;
      if (live && t.moves.length > delayMoves && delayMoves > 0) {
        t.moves = t.moves.slice(0, t.moves.length - delayMoves);
        t.delayedMoves = delayMoves;
      }

      // delay by time
      const epochNowInMs = moment().unix().valueOf() * 1000;
      const cutoffTime = epochNowInMs - this.options.delayedTimeInSec * 1000;
      console.log(
        'before cut off',
        t.moves.length,
        epochNowInMs,
        this.options.delayedTimeInSec,
      );
      if (live && cutoffTime < epochNowInMs) {
        const debug = t.moves.filter((x) => x.movedAt > cutoffTime);
        console.log(
          'filtered',
          debug.map((x) => ({
            at: moment(x.movedAt).format(),
            diff: epochNowInMs - x.movedAt,
          })),
        );
        t.moves = t.moves.filter((x) => x.movedAt <= cutoffTime);
        t.delayedMoves = debug.length;
        t.pointInTime = cutoffTime;
      }
      console.log('actual move display', t.moves.length);
    }
    if (!live) {
      this.cacheManager.set(
        cacheKey,
        t,
        configuration().cache.tournamentTTL * 1000,
      ); // Never need to expired it.
    }
    return t;
  }

  async hello(force = false) {
    if (!force) {
      const cacheData = await this.cacheManager.get(this.tournamentId);
      console.log('Return tournament data from cache');
      return cacheData;
    }

    const t = await this.game.fetchTournament();

    const fetchTask = t.rounds.map(async (r, index) => {
      const rPairs = await this.game.fetchRound(index + 1);
      for await (const pair of rPairs.pairings) {
        const [white, black] = await Promise.all([
          this.fideService.searchUser(
            `${pair.white.lname}, ${pair.white.fname}`,
          ),
          this.fideService.searchUser(
            `${pair.black.lname}, ${pair.black.fname}`,
          ),
        ]);
        if (black && black.id) {
          pair.black.fideid = black.id;
          pair.black.title = black.title;
        }

        if (white && white.id) {
          pair.white.fideid = white.id;
          pair.white.title = white.title;
        }
      }
      return rPairs;
    });
    const rounds = await Promise.all(fetchTask);

    const data = {
      name: t.name,
      location: t.location,

      rounds: rounds.map((p, index) => ({
        index,
        date: p.date,
        live: p.pairings.some((t) => t.live),
        pairs: p.pairings.map((p) => ({
          black: p.black.fname + ', ' + p.black.lname,
          white: p.white.fname + ', ' + p.white.lname,
          result: mapGameResult(p.result),
          live: p.live,
        })),
      })),
    };
    this.dataService.upsert({
      liveChessId: this.tournamentId,
      ...data,
    });
    // check if the round already finished. make cache to infinity
    this.cacheManager.set(
      this.tournamentId,
      data,
      configuration().cache.tournamentTTL,
    );
    return data;
  }
}
