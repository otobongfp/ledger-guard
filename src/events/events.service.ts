import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { EventChain, Event, Binary } from '@ltonetwork/lto';
import { LTOService } from 'common/lto/lto.service';

@Injectable()
export class EventService {
  private redis: Redis;

  constructor(private readonly lto: LTOService) {
    this.redis = new Redis();
  }

  async logEvent(userId: string, logInfo: object): Promise<void> {
    const chainKey = `user:${userId}:event_chain`;
    let chainData = await this.redis.get(chainKey);
    let chain: EventChain;

    const account = this.lto.getAccount();

    if (!chainData) {
      chain = new EventChain(account);
      const initialEvent = new Event(logInfo);
      initialEvent.addTo(chain).signWith(account);
    } else {
      chain = EventChain.from(JSON.parse(chainData));
      const newEvent = new Event(logInfo);
      newEvent.addTo(chain).signWith(account);
    }

    await this.redis.set(chainKey, JSON.stringify(chain.toJSON()));
    await this.anchorEvents(userId);
  }

  async anchorEvents(userId: string): Promise<void> {
    const chainKey = `user:${userId}:event_chain`;
    const chainData = await this.redis.get(chainKey);
    if (!chainData) throw new Error('Event chain not found');

    const chain = EventChain.from(JSON.parse(chainData));

    if (chain.events.length === 0) {
      throw new Error('Event chain is empty, cannot anchor.');
    }

    const lastEventHash = Binary.from(
      chain.events[chain.events.length - 1]?.hash,
    );
    const appendedEvents = chain.startingAfter(lastEventHash);
    const anchorMap = appendedEvents.anchorMap.map(({ key, value }) => ({
      key,
      value,
    }));

    await this.lto.anchor(...anchorMap);

    console.log(`Event chain for user ${userId} anchored successfully`);
  }

  async getLogsByUser(userId: string): Promise<object[]> {
    const chainKey = `user:${userId}:event_chain`;
    const chainData = await this.redis.get(chainKey);

    if (!chainData) throw new Error(`No event chain found for user: ${userId}`);
    const chain = EventChain.from(JSON.parse(chainData));

    return chain.events.map((event) => event.toJSON());
  }
}
