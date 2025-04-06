import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './utils/exceptions/global-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { createDefaultDirs } from './utils/general.utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new Logger(),
  });

  const PORT = process.env.PORT || 5000;

  const config = new DocumentBuilder()
    .setTitle('Vendora')
    .setDescription('The Vendora API description')
    .setVersion('1.0')
    .addTag('e-commerce')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: '*',
  });

  app.setGlobalPrefix('api/v1');

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
    })
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  createDefaultDirs();

  await app.listen(PORT);
}
bootstrap();
