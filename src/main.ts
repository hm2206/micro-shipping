import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SENT_MAIL } from './microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalFilters(new HttpExceptionFilter);
  app.enableCors({ origin: true });
  app.setGlobalPrefix('api');

  // microservices
  app.connectMicroservice(SENT_MAIL);

  await app.startAllMicroservices();

  // server http
  const { PORT, HOST } = process.env;
  await app.listen(PORT,HOST, () => {
    console.log(`Listen server: ${HOST}:${PORT}`);
  });
}
bootstrap();
