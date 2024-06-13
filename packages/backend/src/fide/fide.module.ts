import { Module } from '@nestjs/common';
import { FideService } from './fide.service';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from 'src/db/db.module';
import { FidePlayerController } from './fide.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [HttpModule, DatabaseModule, AuthModule],
  exports: [FideService],
  providers: [FideService, FidePlayerController],
})
export class FideModule {}

// https://app.fide.com/api/v1/client/search?query=Nguyen,%20Anh%20Kiet&link=player
// https://app.fide.com/api/docs
