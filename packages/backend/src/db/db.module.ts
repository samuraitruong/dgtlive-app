import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameData, GameDataSchema } from './schema/game-data.schema';
import { GameDataService } from './game-data.service';
import {
  TournamentData,
  TournamentDataSchema,
} from './schema/tournament-data.schema';
import { TournamentDataService } from './tournament-data.service';
import { FidePlayer, FidePlayerSchema } from './schema/fide-player.schema';
import { FidePlayerService } from './fide-player.service';
import { SponsorService } from './sponsor.service';
import { Sponsor, SponsorSchema } from './schema/sponsor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameData.name, schema: GameDataSchema },
    ]),
    MongooseModule.forFeature([{ name: Sponsor.name, schema: SponsorSchema }]),
    MongooseModule.forFeature([
      { name: TournamentData.name, schema: TournamentDataSchema },
    ]),
    MongooseModule.forFeature([
      { name: FidePlayer.name, schema: FidePlayerSchema },
    ]),
  ],
  controllers: [],
  providers: [
    GameDataService,
    TournamentDataService,
    FidePlayerService,
    SponsorService,
  ],
  exports: [
    GameDataService,
    TournamentDataService,
    FidePlayerService,
    SponsorService,
  ],
})
export class DatabaseModule {}
