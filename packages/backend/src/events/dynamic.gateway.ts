import { WebSocketGateway } from '@nestjs/websockets';
import { EventsService } from './events.service';
import { BaseGateway } from './gateway';
import { DynamicModule, Inject, Module } from '@nestjs/common';
import { CACHE_MANAGER, Cache, CacheModule } from '@nestjs/cache-manager';
import { TournamentRegisterSchema } from 'src/db/tournament';
import mongoose from 'mongoose';
import { EventServiceOptions } from './dto/event-option';
import { TournamentDataService } from '../db/tournament-data.service';
import { DatabaseModule } from 'src/db/db.module';
import { GameDataService } from 'src/db/game-data.service';
import { FideModule } from 'src/fide/fide.module';
import { FideService } from 'src/fide/fide.service';

export function createDynamicGatewayClass(
  path: string,
  options: EventServiceOptions,
): DynamicModule {
  @WebSocketGateway({ path: '/' + path })
  class DynamicGateway extends BaseGateway {
    constructor(
      @Inject(CACHE_MANAGER) cacheManager: Cache,
      dataService: TournamentDataService,
      gameDataService: GameDataService,
      fideService: FideService,
    ) {
      const service = new EventsService(
        cacheManager,
        dataService,
        gameDataService,
        fideService,
        options,
      );
      service.setGameId(options.tournamentId);
      service.hello();
      super(service);
    }
    startUp() {}
  }

  @Module({
    imports: [CacheModule.register(), DatabaseModule, FideModule],
    providers: [DynamicGateway, EventsService],
    exports: [DynamicGateway],
  })
  class DynamicGatewayModule {}

  return {
    module: DynamicGatewayModule,
    providers: [DynamicGateway],
  };
}

export async function registerDynamicSocket(): Promise<DynamicModule> {
  // connect to mongo db

  const conn = await mongoose.connect(process.env.MONGO_URI);

  const TournamentRegisterModel = mongoose.model(
    'tournamentregisters',
    TournamentRegisterSchema,
  );

  const tournaments = await TournamentRegisterModel.find();

  const loadedPlugins: Array<DynamicModule> = tournaments.map((x) =>
    createDynamicGatewayClass(x.slug, {
      tournamentId: x.liveChessId,
      delayedMoves: x.delayMoves,
      delayedTimeInSec: x.delayTimes,
    }),
  );

  conn.disconnect();

  @Module({
    imports: [...loadedPlugins.map((plugin) => plugin.module)],
  })
  class DynamicGatewayModule {}
  return {
    module: DynamicGatewayModule,
  };
}
