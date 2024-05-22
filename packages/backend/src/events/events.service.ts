import { Injectable } from '@nestjs/common';
import configuration from 'src/config/configuration';

import { LiveChessTournament, GameEventResponse } from 'library';
import { LoadGameDto } from './dto/game-event.dto';

@Injectable()
export class EventsService {

  readonly game: LiveChessTournament;
  constructor() {
    this.game = new LiveChessTournament(configuration().game.id)

  }

  async loadGame(game: LoadGameDto): Promise<GameEventResponse> {
    const tour = await this.game.fetchTournament();
    const { moves, live } = await this.game.fetchGame(game.round, game.game);
    const t: GameEventResponse = {
      isLive: live,
      ...game,
      moves: moves.map(x => ({
        san: x[0],
        fen: x[1],
        time: +x[2]?.split('+')[0],
        arrow: [x[3], x[4]]
      }))
    };
    const delayMoves = configuration().game.delayMoves
    if (live && t.moves.length > delayMoves) {
      t.moves = t.moves.slice(0, t.moves.length - delayMoves)
      t.delayedMoves = delayMoves;
    }
    return t;
  }

  async hello(force = false) {
    const t = await this.game.fetchTournament(force);

    const fetchTask = t.rounds.map((r, index) => this.game.fetchRound(index + 1))
    const rounds = await Promise.all(fetchTask)

    return {
      name: t.name,
      location: t.location,

      rounds: rounds.map((p, index) => ({
        index,
        date: p.date,
        live: p.pairings.some(t => t.live),
        pairs: p.pairings.map(p => ({
          black: p.black.fname + ', ' + p.black.lname,
          white: p.white.fname + ', ' + p.white.lname,
          result: p.result,
          live: p.live
        }))
      }))
    }
  }
}
