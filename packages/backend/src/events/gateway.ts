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

export class BaseGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() private server: any;
  private liveGames: GameEventResponse[] = [];

  wsClients = [];

  constructor(private readonly eventsService: EventsService) {
    setInterval(() => this.intervalCheck(), 5000);
    setInterval(() => this.refreshTournament(), 60000);
  }

  private async refreshTournament() {
    const t = await this.eventsService.hello(true);
    this.broadcast('tournament', t);
  }
  private async intervalCheck() {
    for await (const game of this.liveGames) {
      const data = await this.eventsService.loadGame(game);
      game.isLive = data.isLive;
      this.broadcast('game', data);
    }
    this.liveGames = this.liveGames.filter((x) => x.isLive);
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
  private broadcast(event, data: any) {
    for (const c of this.wsClients) {
      c.send({ event, data });
    }
  }

  @SubscribeMessage('hello')
  async hello() {
    return {
      event: 'hello',
      data: await this.eventsService.hello(),
    };
  }

  @SubscribeMessage('game')
  async game(@MessageBody() game: LoadGameDto) {
    const data = await this.eventsService.loadGame(game);
    if (data.isLive) {
      const findGame = this.liveGames.find(
        (x) => x.game == data.game && x.round == data.round,
      );
      if (!findGame) {
        this.liveGames.push(data);
      }
    }
    return {
      event: 'game',
      data,
    };
  }

  @SubscribeMessage('admin')
  async admin(@MessageBody() game: AdminDto) {
    const result = await this.eventsService.setGameId(game.gameId);

    await this.refreshTournament();
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
}
