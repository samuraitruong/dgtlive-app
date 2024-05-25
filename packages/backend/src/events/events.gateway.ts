import { WebSocketGateway, } from '@nestjs/websockets';
import { EventsService } from './events.service';
import { BaseGateway } from './gateway';
import configuration from 'src/config/configuration';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

@WebSocketGateway({ path: '/junior' })
export class JuniorEventsGateway extends BaseGateway {

  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {

    const service = new EventsService(cacheManager);
    service.setGameId(configuration().game.juniorTournamentId)
    super(service)
  }
}
