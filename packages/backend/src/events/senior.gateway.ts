import { WebSocketGateway, } from '@nestjs/websockets';
import { EventsService } from './events.service';
import { BaseGateway } from './gateway';
import configuration from 'src/config/configuration';

@WebSocketGateway({ path: '/senior' })
export class SeniorEventsGateway extends BaseGateway {

  constructor() {
    var service = new EventsService()
    service.setGameId(configuration().game.seniorTournamentId)
    super(service)
  }
}
