import { Injectable } from '@nestjs/common';
import configuration from 'src/config/configuration';

import { LiveChessTournament, GameEventResponse } from 'library';
import { LoadGameDto } from './dto/game-event.dto';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class EventsService {
  private tournamentId: string;

  readonly game: LiveChessTournament;

  constructor(private cacheManager: Cache) {
    this.tournamentId = configuration().game.juniorTournamentId;
    this.game = new LiveChessTournament(
      configuration().game.juniorTournamentId,
    );
  }

  async setGameId(tournamentId: string) {
    console.log("Overwritting game id to ", tournamentId);
    this.tournamentId = tournamentId;
    this.game.setGame(tournamentId);
    await this.hello(true);
  }

  async loadGame(game: LoadGameDto): Promise<GameEventResponse> {
    const cacheKey = `${this.tournamentId}-${game.round}-${game.game}`;
    const tour = await this.cacheManager.get<GameEventResponse>(cacheKey);
    if (tour) {
      return tour;
    }
    const { moves, live } = await this.game.fetchGame(game.round, game.game);
    const extractTime = (t: string) => {
      const [time, spent] = t.split('+');
      return {
        time: +time,
        moveTime: +spent

      }
    }
    const t: GameEventResponse = {
      isLive: live,
      ...game,
      moves: moves.map((x) => ({
        ...extractTime(x[2]),
        san: x[0],
        fen: x[1],
        arrow: [x[3], x[4]],
      })),
    };
    const delayMoves = configuration().game.delayMoves;
    if (live && t.moves.length > delayMoves) {
      t.moves = t.moves.slice(0, t.moves.length - delayMoves);
      t.delayedMoves = delayMoves;
    }

    if (!live) {
      this.cacheManager.set(cacheKey, t, configuration().cache.tournamentTTL * 1000) // Never need to expired it.
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
