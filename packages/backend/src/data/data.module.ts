import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TournamentRegisterSchema } from 'src/db/tournament';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicDataController } from './public.controller';
import { SponsorController } from './sponsor.controller';
import { DatabaseModule } from 'src/db/db.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'TournamentRegister', schema: TournamentRegisterSchema },
    ]),
    AuthModule,
    DatabaseModule,
  ],
  controllers: [DataController, PublicDataController, SponsorController],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
