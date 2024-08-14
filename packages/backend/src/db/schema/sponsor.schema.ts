import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Sponsor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  logoUrl: string;

  @Prop({ required: false })
  desciption: string;

  @Prop({ required: false })
  tournaments: string[];
}

export type SponsorDocument = Sponsor & Document;
export const SponsorSchema = SchemaFactory.createForClass(Sponsor);
