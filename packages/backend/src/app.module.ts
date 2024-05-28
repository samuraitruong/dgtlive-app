import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    CacheModule.register(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'frontend/out'),
      serveRoot: '/',
    }),
    EventsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'JUNIOR_TOURNAMENT_ID',
      useValue: configuration().game.juniorTournamentId,
    },
    {
      provide: 'SENIOR_TOURNAMENT_ID',
      useValue: configuration().game.seniorTournamentId,
    },
  ],
})
export class AppModule { }
