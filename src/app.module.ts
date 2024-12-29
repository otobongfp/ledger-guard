import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './common/redis/redis.module';
import { ConfigModule } from './common/config/config.module';
import { EventsModule } from './events/events.module';
import { UserModule } from './user/user.module';
import { VerifySignatureMiddleware } from 'common/http-signature/verify-signature.middleware';

export const AppModuleConfig = {
  imports: [RedisModule, ConfigModule, EventsModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
};

@Module(AppModuleConfig)
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifySignatureMiddleware)
      .forRoutes({ path: 'events/*', method: RequestMethod.ALL });
  }
}
