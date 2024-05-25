import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { JuniorEventsGateway } from './events.gateway';
import { SeniorEventsGateway } from './senior.gateway';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  providers: [JuniorEventsGateway, SeniorEventsGateway, EventsService],
})
export class EventsModule { }
