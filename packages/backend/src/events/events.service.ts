import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import configuration from 'src/config/configuration';

import {LiveChessTournament} from 'library';

@Injectable()
export class EventsService {
  readonly game: LiveChessTournament;
  constructor() {
     this.game = new LiveChessTournament(configuration().game.id)

  }
  create(createEventDto: CreateEventDto) {
    return 'This action adds a new event';
  }

  async hello() {
    const t = await this.game.fetchTournament();
  
    const fetchTask = t.rounds.map((r, index) => this.game.fetchRound(index+1))


    return {
      name: t.name,
      location: t.location,
      pairs: await Promise.all(fetchTask)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
