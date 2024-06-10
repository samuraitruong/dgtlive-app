import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameData, GameDataSchema } from './game-data.schema';
import { GameDataService } from './game-data.service';
import { TournamentData, TournamentDataSchema } from './tournament-data.schema';
import { TournamentDataService } from './tournament-data.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameData.name, schema: GameDataSchema },
    ]),
    MongooseModule.forFeature([
      { name: TournamentData.name, schema: TournamentDataSchema },
    ]),
  ],
  controllers: [],
  providers: [GameDataService, TournamentDataService],
  exports: [GameDataService, TournamentDataService],
})
export class DatabaseModule {}
