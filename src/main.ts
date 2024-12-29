import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from 'common/config/config.service';
import { INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function swagger(app: INestApplication, config: ConfigService) {
  const prefix = config.api.prefix ? `${config.api.prefix}` : '';
  const configuration = new DocumentBuilder()
    .setTitle(config.app.name)
    .setDescription(config.app.description)
    .setVersion(config.app.version)
    .build();
  const document = SwaggerModule.createDocument(app, configuration);
  SwaggerModule.setup(config.api.docs, app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  const config = app.get<ConfigService>(ConfigService);

  if (config.api.prefix) {
    app.setGlobalPrefix(config.api.prefix);
  }

  app.enableCors();
  app.use(cookieParser());
  const port = process.env.PORT || 3000;
  swagger(app, config);

  await app.listen(port);
}
bootstrap();
