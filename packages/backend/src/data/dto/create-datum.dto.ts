import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDatumDto {
  @IsNotEmpty()
  slug: string;
  @IsNumber()
  delayMoves: number;
  @IsNumber()
  delayTimes: number;
  name: string;
  @IsNotEmpty()
  liveChessId: string;
}
