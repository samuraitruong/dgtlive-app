import { Controller, Get } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('public')
export class PublicDataController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  async findAll() {
    const allData = await this.dataService.findAll();
    return allData
      .filter((x) => x.isActive)
      .map((x) => ({ name: x.name, slug: x.slug }));
  }
}
