import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const origins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim());
  app.enableCors({ origin: origins, credentials: true });

  await app.listen(process.env.PORT ?? 3010);
}
bootstrap();
