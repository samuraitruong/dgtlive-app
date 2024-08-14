import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDataDocument = GameData & Document;

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

const PairSchema = SchemaFactory.createForClass(Pair);

@Schema({ _id: false })
class Move {
  @Prop({ required: true })
  time: number;

  @Prop({ required: true })
  moveTime: number;

  @Prop({ required: true })
  movedAt: number;

  @Prop({ required: true })
  san: string;

  @Prop({ required: true })
  fen: string;

  @Prop({ type: [String], required: true })
  arrow: string[];
}

const MoveSchema = SchemaFactory.createForClass(Move);

@Schema()
export class GameData {
  @Prop({ type: PairSchema, required: true })
  pair: Pair;

  @Prop({ required: false })
  result: string;

  @Prop({ required: true })
  liveChessId: string;

  @Prop({ required: true })
  isLive: boolean;

  @Prop({ required: true })
  round: number;

  @Prop({ required: true })
  game: number;

  @Prop({ type: [MoveSchema], required: true })
  moves: Move[];
}

export const GameDataSchema = SchemaFactory.createForClass(GameData);
