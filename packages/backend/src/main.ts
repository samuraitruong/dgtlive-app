import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from './middleware/app.filter';

async function bootstrap() {
  const corsOptions: CorsOptions = {
    origin: '*', // Replace with your allowed origin(s)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept,Authorization',
  };

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(corsOptions);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new CustomExceptionFilter());

  // const gatewayManager = app.get<GatewayManagerService>(GatewayManagerService);
  // gatewayManager.bootstrap();

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
