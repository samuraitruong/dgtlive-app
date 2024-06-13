import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FidePlayerService } from '../db/fide-player.service';
import { AuthGuard } from '../auth/auth.guard';
import { SearchFidePlayerDto } from './dto/player-search.dto';
import { ParseFilterPipe } from 'src/pipes/parse-filter.pipe';

@Controller('player')
@UseGuards(AuthGuard)
export class FidePlayerController {
  constructor(private readonly fidePlayerService: FidePlayerService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPlayers(
    @Query() query: SearchFidePlayerDto,
    @Query('filter', ParseFilterPipe) filter: any,
  ) {
    const { searchName, sortField, sortOrder, page, limit } = query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const nameSearch = this.fidePlayerService.getSearchNameFilter(searchName);
    const { data, total } = await this.fidePlayerService.findAll(
      pageNumber,
      limitNumber,
      sortField,
      sortOrder,
      nameSearch || filter,
    );

    return {
      data: data.map(({ name, id, ratings, title, fideTitle }) => ({
        name,
        id,
        ratings,
        title,
        fideTitle,
      })),
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }
}
