import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventsController } from './events.controller';
import { LTOService } from 'common/lto/lto.service';
import { ConfigService } from 'common/config/config.service';
import { LogTypeProvider } from './logtype.provider';

@Module({
  providers: [EventService, LTOService, ConfigService, LogTypeProvider],
  controllers: [EventsController],
})
export class EventsModule {}
