import configuration from 'src/config/configuration';
import * as moment from 'moment'
import {
  LiveChessTournament,
  GameEventResponse,
  Tournament,
  Pair,
} from 'library';
import { LoadGameDto } from './dto/game-event.dto';
import { Cache } from '@nestjs/cache-manager';
import { EventServiceOptions } from './dto/event-option';

export class EventsService {
  private tournamentId: string;

  readonly game: LiveChessTournament;

  constructor(private cacheManager: Cache, private options: EventServiceOptions) {
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
    const { moves, live, startedAt } = await this.game.fetchGame(game.round, game.game);
    let previousMovedAt = startedAt;
    const extractTime = (t: string) => {
      if (!t) {
        return { time: 0, moveTime: 0 };
      }
      const [time, spent] = t.split('+');

      previousMovedAt = previousMovedAt + (+spent || 0) * 1000;
      return {
        time: +time,
        moveTime: +spent,
        movedAt: previousMovedAt,
      };
    };
    const cacheData = (await this.cacheManager.get(
      this.tournamentId,
    )) as Tournament;
    const pair = cacheData.rounds[game.round - 1].pairs[game.game - 1] as Pair;

    const t: GameEventResponse = {
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
    const delayMoves = this.options.delayedMoves;
    if (live && t.moves.length > delayMoves && delayMoves > 0) {
      t.moves = t.moves.slice(0, t.moves.length - delayMoves);
      t.delayedMoves = delayMoves;
    }
    // delay by time
    const epochNowInMs = moment().unix().valueOf() * 1000
    const cutoffTime = epochNowInMs - this.options.delayedTimeInSec * 1000;

    if (live && cutoffTime < epochNowInMs) {
      t.moves = t.moves.filter(x => x.movedAt <= cutoffTime);
      t.delayedMoves = delayMoves;
      t.pointInTime = cutoffTime;
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

    const fetchTask = t.rounds.map((r, index) =>
      this.game.fetchRound(index + 1),
    );
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
          result: p.result,
          live: p.live,
        })),
      })),
    };
    this.cacheManager.set(
      this.tournamentId,
      data,
      configuration().cache.tournamentTTL,
    );
    return data;
  }
}
