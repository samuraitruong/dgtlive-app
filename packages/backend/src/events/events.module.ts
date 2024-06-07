import { Module, OnModuleInit } from '@nestjs/common';
import { EventsService } from './events.service';
import { JuniorEventsGateway } from './events.gateway';
import { SeniorEventsGateway } from './senior.gateway';
import { CacheModule } from '@nestjs/cache-manager';
import { GatewayManagerService } from './gateway.manager';
import { registerDynamicSocket } from './dynamic.gateway';
// import { ModuleRef } from '@nestjs/core';

@Module({
  imports: [CacheModule.register(), registerDynamicSocket()],
  providers: [JuniorEventsGateway, SeniorEventsGateway, EventsService, GatewayManagerService],
  exports: [GatewayManagerService]
})
export class EventsModule

  implements OnModuleInit {
  constructor(
    // private readonly gatewayManager: GatewayManagerService,
    // private readonly moduleRef: ModuleRef
  ) {
  }

  async onModuleInit() {
  }
}
