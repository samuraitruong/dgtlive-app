import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreateSponsorDto, UpdateSponsorDto } from '../db/dto/sponsor.dto';
import { Sponsor } from '../db/schema/sponsor.schema';
import { SponsorService } from '../db/sponsor.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('sponsors')
@UseGuards(AuthGuard)
export class SponsorController {
  constructor(private readonly sponsorService: SponsorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSponsorDto: CreateSponsorDto): Promise<Sponsor> {
    return this.sponsorService.create(createSponsorDto);
  }

  @Get()
  async findAll(): Promise<Sponsor[]> {
    return this.sponsorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sponsor> {
    return this.sponsorService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSponsorDto: UpdateSponsorDto,
  ): Promise<Sponsor> {
    return this.sponsorService.update(id, updateSponsorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.sponsorService.remove(id);
  }
}
