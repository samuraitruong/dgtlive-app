import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FidePlayerService } from '../db/fide-player.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('player')
@UseGuards(AuthGuard)
export class FidePlayerController {
  constructor(private readonly fidePlayerService: FidePlayerService) {}

  @Get()
  async getPlayers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortField') sortField: string = 'name',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('filter') filter: Partial<FidePlayer> = {},
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const { data, total } = await this.fidePlayerService.findAll(
      pageNumber,
      limitNumber,
      sortField,
      sortOrder,
      filter,
    );

    return {
      data,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }
}
