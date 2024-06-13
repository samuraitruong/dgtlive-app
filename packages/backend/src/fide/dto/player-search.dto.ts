// src/fide-player/dto/search-fide-player.dto.ts

import { IsOptional, IsString } from 'class-validator';

export class SearchFidePlayerDto {
  @IsOptional()
  @IsString()
  searchName?: string;

  @IsOptional()
  @IsString()
  sortField?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  page?: string; // will be parsed as number

  @IsOptional()
  @IsString()
  limit?: string; // will be parsed as number

  @IsOptional()
  @IsString()
  filter?: string; // JSON string for additional filters
}
