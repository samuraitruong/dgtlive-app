import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TournamentRegisterSchema } from 'src/db/tournament';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'TournamentRegister', schema: TournamentRegisterSchema },
    ]),
    AuthModule,
  ],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
