import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { EventService } from './events.service';
import { LogInfo } from '../common/interfaces/logInfo';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { LogTypeProvider } from './logtype.provider';
import { Signer } from '../common/http-signature/signer';
import { Account } from '@ltonetwork/lto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventService: EventService,
    private readonly logTypeProvider: LogTypeProvider,
  ) {}

  @Post('log')
  @ApiOperation({ summary: 'Log an event and anchor it to the blockchain' })
  @ApiBody({
    description: 'The event information to be logged',
    examples: {
      login: {
        summary: 'User Login Event',
        value: {
          logType: 'LOGIN',
          userId: 'user123',
          metadata: {
            status: 'success',
            ip: '192.168.1.1',
            userAgent: 'Mozilla/5.0',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Event logged and anchored successfully',
    schema: {
      example: {
        message: 'Event logged and anchored successfully',
        eventMessage: {
          '@context': 'auth_event.json',
          action: 'user_login',
          userId: 'user123',
          status: 'success',
          timestamp: '2024-12-29T12:00:00Z',
          metadata: {
            ip: '192.168.1.1',
            userAgent: 'Mozilla/5.0',
          },
        },
      },
    },
  })
  async logEvent(
    @Body() logInfo: LogInfo,
    @Signer() signer: Account,
  ): Promise<any> {
    console.log(signer);
    const eventMessage = this.logTypeProvider.buildEventMessage(logInfo);
    await this.eventService.logEvent(signer.address, eventMessage);
    return { message: 'Event logged and anchored successfully', eventMessage };
  }

  @Get(':userId/logs')
  @ApiOperation({ summary: 'Retrieve all logs for a specific user' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user whose logs should be retrieved',
    example: 'user123',
  })
  @ApiResponse({
    status: 200,
    description: 'Logs retrieved successfully',
    schema: {
      example: {
        userId: 'user123',
        logs: [
          {
            timestamp: '2024-12-29T12:00:00Z',
            previous: null,
            signKey: {
              keyType: 'ed25519',
              publicKey: '2KduZAmAKuXEL463udjCQkVfwJkBQhpciUC4gNiayjSJ',
            },
            signature:
              '4xn3xqLFXDLVtUjyKXAjTVGfjWkbCbtyQxFSVoYGLRzePGeyRAeEU7a29ZFztgD3ifwBBMWv9T51ecY2ZBNyWvXV',
            hash: '9Y9DhjXHdrsUE93TZzSAYBWZS5TDWWNKKh2mihqRCGXh',
            mediaType: 'application/json',
            data: {
              '@context': 'auth_event.json',
              action: 'user_login',
              userId: 'user123',
              status: 'success',
              timestamp: '2024-12-29T12:00:00Z',
              metadata: {
                ip: '192.168.1.1',
                userAgent: 'Mozilla/5.0',
              },
            },
          },
        ],
      },
    },
  })
  async getLogsByUser(@Param('userId') userId: string): Promise<any> {
    const logs = await this.eventService.getLogsByUser(userId);
    return { userId, logs };
  }
}
