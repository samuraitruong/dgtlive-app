import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DataService } from './data.service';
import { CreateDatumDto } from './dto/create-datum.dto';
import { UpdateDatumDto } from './dto/update-datum.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('data')
@UseGuards(AuthGuard)
export class DataController {
  constructor(private readonly dataService: DataService) { }

  @Post()
  create(@Body() createDatumDto: CreateDatumDto) {
    return this.dataService.create(createDatumDto);
  }

  @Get()
  async findAll() {
    const allData = await this.dataService.findAll();
    return allData.map(x => ({ ...x, id: x._id, _id: undefined }))

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatumDto: UpdateDatumDto) {
    return this.dataService.update(id, updateDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataService.remove(id);
  }
}
