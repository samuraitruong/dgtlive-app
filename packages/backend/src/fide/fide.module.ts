import { Module } from '@nestjs/common';
import { FideService } from './fide.service';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from 'src/db/db.module';

@Module({
  imports: [HttpModule, DatabaseModule],
  exports: [FideService],
  providers: [FideService],
})
export class FideModule {}

// https://app.fide.com/api/v1/client/search?query=Nguyen,%20Anh%20Kiet&link=player
// https://app.fide.com/api/docs
