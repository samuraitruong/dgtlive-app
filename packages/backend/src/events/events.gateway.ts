import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { EventsService } from './events.service';
import { LoadGameDto } from './dto/game-event.dto';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  @WebSocketServer() private server: any;
  private liveGames: any[] = [];

  wsClients = [];

  constructor(private readonly eventsService: EventsService) {
    setInterval(() => this.intervalCheck(), 5000)
    setInterval(() => this.refreshTournament(), 6000)
  }

  private async refreshTournament() {
    const t = await this.eventsService.hello(true)
    this.broadcast('tournament', t);
  }
  private async intervalCheck() {
    for await (const game of this.liveGames) {
      const data = await this.eventsService.loadGame(game);
      this.broadcast("game", data)
      // check if game already finished then removed it from live game
    }
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
    for (let c of this.wsClients) {
      c.send({ event, data });
    }
  }


  @SubscribeMessage('hello')
  async hello() {
    return {
      event: 'hello',
      data: await this.eventsService.hello()
    }

  }

  @SubscribeMessage('game')
  async game(@MessageBody() game: LoadGameDto) {
    const data = await this.eventsService.loadGame(game);
    if (data.isLive) {
      this.liveGames.push(data);
    }
    return {
      event: 'game',
      data
    }
  }

}
