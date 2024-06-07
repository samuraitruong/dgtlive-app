import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { FallbackMiddleware } from './middleware/fallback.middleware';
import { DataModule } from './data/data.module';

@Module({
  imports: [

    CacheModule.register(),
    ConfigModule.forRoot({ load: [configuration] }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    CacheModule.register(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'frontend/out'),
      serveRoot: '/',
    }),
    EventsModule,
    AuthModule,
    DataModule,
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FallbackMiddleware)
      .forRoutes({ path: 'tournament/*', method: RequestMethod.ALL });
  }
}
