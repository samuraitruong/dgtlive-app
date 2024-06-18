import { WebSocketGateway } from '@nestjs/websockets';
import { EventsService } from './events.service';
import { BaseGateway } from './gateway';
import configuration from 'src/config/configuration';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { TournamentDataService } from 'src/db/tournament-data.service';
import { GameDataService } from 'src/db/game-data.service';
import { FideService } from 'src/fide/fide.service';
import { DataService } from 'src/data/data.service';

@WebSocketGateway({ path: '/junior' })
export class JuniorEventsGateway extends BaseGateway {
  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    private dataService: TournamentDataService,
    private tournamentRegister: DataService,
    gameDataService: GameDataService,
    fideService: FideService,
  ) {
    const config = configuration();

    const service = new EventsService(
      cacheManager,
      dataService,
      gameDataService,
      fideService,
      {
        delayedMoves: config.game.delayMoves,
        delayedTimeInSec: config.game.delayTimeInSeconds,
      },
    );
    service.setGameId(configuration().game.juniorTournamentId);
    super(service);
    this.bootstrap();
  }
  async bootstrap() {
    const data = await this.tournamentRegister.findOneBy({ slug: 'junior' });
    if (data) {
      await this.replaceTournamenIdOnFly(data.liveChessId);
    }
  }
}
