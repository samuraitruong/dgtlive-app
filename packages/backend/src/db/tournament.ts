import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TournamentRegister {
  @Prop()
  id: string;
  @Prop()
  slug: string;

  @Prop()
  liveChessId: string;

  @Prop()
  name: string;

  @Prop()
  delayMoves: number;

  @Prop()
  delayTimes?: number;

  @Prop()
  isActive?: boolean;
}

export type TournamentRegisterrDocument = TournamentRegister & Document;
export const TournamentRegisterSchema =
  SchemaFactory.createForClass(TournamentRegister);
