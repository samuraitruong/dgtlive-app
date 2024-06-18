import { Module, OnModuleInit } from '@nestjs/common';
import { EventsService } from './events.service';
import { JuniorEventsGateway } from './events.gateway';
import { SeniorEventsGateway } from './senior.gateway';
import { CacheModule } from '@nestjs/cache-manager';
import { GatewayManagerService } from './gateway.manager';
import { registerDynamicSocket } from './dynamic.gateway';
import { DatabaseModule } from '../db/db.module';
import { FideModule } from '../fide/fide.module';
import { DataModule } from '../data/data.module';
// import { ModuleRef } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.register(),
    registerDynamicSocket(),
    DatabaseModule,
    FideModule,
    DataModule,
  ],
  providers: [
    JuniorEventsGateway,
    SeniorEventsGateway,
    EventsService,
    GatewayManagerService,
    FideModule,
  ],
  exports: [GatewayManagerService],
})
export class EventsModule implements OnModuleInit {
  constructor() {} // private readonly moduleRef: ModuleRef // private readonly gatewayManager: GatewayManagerService,

  async onModuleInit() {}
}
