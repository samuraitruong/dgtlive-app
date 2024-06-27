import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Player {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  elo: string;

  @Prop({ required: false })
  title: string;

  @Prop({ required: false })
  fideId: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

@Schema()
export class Pair {
  @Prop({ required: true, type: PlayerSchema })
  black: Player;

  @Prop({ required: true, type: PlayerSchema })
  white: Player;

  @Prop({ required: true })
  result: string;

  @Prop({ required: true })
  live: boolean;
}

export const PairSchema = SchemaFactory.createForClass(Pair);

@Schema()
export class Round {
  @Prop({ required: true })
  index: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  live: boolean;

  @Prop({ type: [PairSchema], required: true })
  pairs: Pair[];
}

export const RoundSchema = SchemaFactory.createForClass(Round);

@Schema({ timestamps: true, collection: 'tournaments' })
export class TournamentData {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  liveChessId: string;

  @Prop({ required: false })
  location: string;

  @Prop({ type: [RoundSchema], required: true })
  rounds: Round[];

  @Prop({ default: false })
  isFinished: boolean;
}

export type TournamentDataDocument = TournamentData & Document;
export const TournamentDataSchema =
  SchemaFactory.createForClass(TournamentData);
