import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FidePlayerService } from '../db/fide-player.service';
import { AuthGuard } from '../auth/auth.guard';
import { SearchFidePlayerDto } from './dto/player-search.dto';
import { ParseFilterPipe } from 'src/pipes/parse-filter.pipe';
import { FidePlayer } from '../db/schema/fide-player.schema';
import { FideService } from './fide.service';

@Controller('player')
@UseGuards(AuthGuard)
export class FidePlayerController {
  constructor(
    private readonly fidePlayerService: FidePlayerService,
    private readonly fideService: FideService,
  ) {}

  @Patch('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updatePlayer(@Param() id: string, @Body() data: Partial<FidePlayer>) {
    const raw = await this.fidePlayerService.patchPlayerData(id, data);

    return this.cleanPlayer(raw);
  }

  @Post('/:id/sync')
  @UsePipes(new ValidationPipe({ transform: true }))
  async syncPlayerData(@Param() id: string) {
    const raw = await this.fideService.syncFilePlayerRating(id);
    if (!raw) {
      throw new NotFoundException('Player not exists');
    }
    return this.cleanPlayer(raw);
  }

  @Delete('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async deletePlayer(@Param() id: string) {
    await this.fidePlayerService.deleteFidePlayer(id);

    return true;
  }

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
      data: data.map(
        ({ _id, name, id, ratings, title, fideTitle, birthYear }) => ({
          _id: _id,
          name,
          id,
          ratings,
          birthYear,
          title,
          fideTitle,
        }),
      ),
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }
  private cleanPlayer(p: FidePlayer): Partial<FidePlayer> {
    const { _id, name, id, ratings, title, fideTitle } = p as any;

    return {
      _id: _id.toString(),
      name,
      id,
      ratings,
      title,
      fideTitle,
    } as any;
  }
}
