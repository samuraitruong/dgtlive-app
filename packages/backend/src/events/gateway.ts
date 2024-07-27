import {
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { EventsService } from './events.service';
import { LoadGameDto } from './dto/game-event.dto';
import { AdminDto } from './dto/admin.dto';
import { GameEventResponse } from 'library';
import { UseFilters } from '@nestjs/common';
import { SocketExceptionFilter } from './socket.exception.filter';
import { hashObject } from 'src/util';
import { EventServiceOptions } from './dto/event-option';

export interface LiveGame {
  lastFetch?: number;
  nextFetch?: number;
  hash?: string;
  data: GameEventResponse;
}

export class BaseGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() public server: any;
  public liveGames: LiveGame[] = [];
  public tournament: any;
  wsClients = [];

  constructor(public readonly eventsService: EventsService) {
    setInterval(() => this.intervalCheck(), 5000);
    setInterval(() => this.refreshTournament(), 60000);
  }

  public async refreshTournament() {
    try {
      const t = await this.eventsService.hello(true);
      this.broadcast('tournament', t);
    } catch (error) {
      console.warn(error);
    }
  }
  public async intervalCheck() {
    console.log('Live game to check %d', this.liveGames.length);
    for await (const liveGame of this.liveGames) {
      try {
        const game = liveGame.data;
        const data = await this.eventsService.loadGame(game);
        game.isLive = data.isLive;
        liveGame.data = game;
        const newHash = hashObject(data);
        liveGame.lastFetch = new Date().getTime();
        if (liveGame.hash != newHash) {
          console.log('broadcasing game to client');
          this.broadcast('game', data);
          liveGame.hash = newHash;
        }
      } catch (err) {
        console.warn(err);
      }
    }
    this.liveGames = this.liveGames.filter((x) => x.data.isLive);
  }

  afterInit() {
    this.server.emit('welcome', { text: 'Hello world' });
  }

  handleConnection(client: any) {
    this.wsClients.push(client);
  }

  handleDisconnect(client) {
    for (let i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i] === client) {
        this.wsClients.splice(i, 1);
        break;
      }
    }
    this.broadcast('disconnect', {});
  }
  public broadcast(event, data: any) {
    for (const c of this.wsClients) {
      c.send({ event, data });
    }
  }

  @SubscribeMessage('hello')
  async hello() {
    this.tournament = await this.eventsService.hello();
    return {
      event: 'hello',
      data: this.tournament,
    };
  }

  @SubscribeMessage('game')
  async game(@MessageBody() game: LoadGameDto) {
    const data = await this.eventsService.loadGame(game);
    if (data.isLive) {
      const findGame = this.liveGames.find(
        (x) => x.data.game == data.game && x.data.round == data.round,
      );
      if (!findGame) {
        this.liveGames.push({ data });
      }
    }
    return {
      event: 'game',
      data,
    };
  }

  @SubscribeMessage('admin')
  async admin(@MessageBody() game: AdminDto) {
    const result = await this.replaceTournamenIdOnFly(game.gameId);
    return {
      event: 'admin',
      data: {
        status: result != null,
      },
    };
  }
  @UseFilters(SocketExceptionFilter)
  public handleException(error: Error, client: any): void {
    console.error(`Error from client: ${error.message}`);
    client.error(error.message);
  }

  public async replaceTournamenIdOnFly(
    tournamentId: string,
    options?: EventServiceOptions,
  ) {
    if (tournamentId != this.eventsService.tournamentId) {
      if (options) {
        this.eventsService.setConfig(options);
      }
      const result = await this.eventsService.setGameId(tournamentId);
      await this.refreshTournament();
      // TODO: remove live games
      return result;
    } else {
      console.log(
        'Ignore the replace tournament id as data is the same with current tournament',
      );
    }
    return undefined;
  }
}
