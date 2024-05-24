import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { JuniorEventsGateway } from './events.gateway';
import { SeniorEventsGateway } from './senior.gateway';

@Module({
  providers: [JuniorEventsGateway, SeniorEventsGateway, EventsService],
})
export class EventsModule { }
