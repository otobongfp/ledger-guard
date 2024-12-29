import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { camelCase } from '../../utils/transform-case';
import * as fs from 'fs';

@Injectable()
export class ConfigService extends NestConfigService {
  public readonly app: { name: string; description: string; version: string };

  constructor() {
    super();

    const packageJson = fs.readFileSync('package.json', 'utf8');
    const { name, description, version } = JSON.parse(packageJson);
    this.app = { name: camelCase(name), description, version };
  }

  get lto() {
    const networkId = this.get<string>('NETWORK_ID');
    const seed = this.get<string>('SEED');
    const relayURL = this.get<string>('RELAY_URL');

    return { networkId, seed, relayURL };
  }

  get auth() {
    const jwt_secret = this.get<string>('JWT_SECRET');
    return {
      jwt_secret,
    };
  }

  get api() {
    const prefix = this.get<string>('API_PREFIX');
    return {
      prefix,
      docs: prefix ? `/${prefix}/api-docs` : '/api-docs',
    };
  }

  get node() {
    const nodeEnv = this.get<string>('NODE_ENV') || 'development';
    return {
      env: nodeEnv,
      isEnv: (env: string | string[]) =>
        typeof env === 'string' ? env === nodeEnv : env.includes(nodeEnv),
    };
  }

  get public_url() {
    const mainnet = this.get<string>('PUBLIC_NODE_URL_MAINNET');
    const testnet = this.get<string>('PUBLIC_NODE_URL_TESTNET');
    return { mainnet, testnet };
  }

  get networkId() {
    const id = this.get<string>('NETWORK_ID');
    return id;
  }

  get port() {
    return Number(this.get<string>('PORT') || 3000);
  }

  get redis() {
    const redisUrl = process.env.REDIS_URL || null;
    let host: string | undefined,
      port: number | undefined,
      username: string | undefined,
      password: string | undefined,
      tls: object | undefined;

    if (redisUrl) {
      const parsedUrl = new URL(redisUrl);
      host = parsedUrl.hostname;
      port = parseInt(parsedUrl.port, 10);
      username = parsedUrl.username;
      password = parsedUrl.password;
      tls = redisUrl.startsWith('rediss://') ? {} : undefined;
    } else {
      host = process.env.REDIS_HOST;
      port = parseInt(process.env.REDIS_PORT, 10);
      username = process.env.REDIS_USERNAME;
      password = process.env.REDIS_PASSWORD;
      tls = process.env.REDIS_USE_TLS === 'true' ? {} : undefined;
    }

    return {
      host,
      port,
      username,
      password,
      tls,
    };
  }

  get database() {
    const url = this.getOrThrow<string>('DATABASE_URL');
    const port = this.get<string>('DB_PORT');
    const password = this.get<string>('DB_PASSWORD');
    const synchronize =
      this.get<boolean>('DB_SYNCHRONIZE') ??
      (this.node.isEnv('development') || this.node.isEnv('test'));

    const parsedUrl = new URL(url);
    if (port) parsedUrl.port = port;
    if (password) parsedUrl.password = password;

    const type = parsedUrl.protocol.replace(':', '');

    // Map `postgresql` to `postgres`
    const driverType = type === 'postgresql' ? 'postgres' : type;

    return {
      type: driverType,
      url: parsedUrl.toString(),
      synchronize,
    };
  }

  get seed(): string {
    const seed = this.get<string>('SEED');
    if (!seed) {
      throw new Error('SEED is not defined in the environment variables');
    }
    return seed;
  }

  get genesis_address(): string[] {
    const address = this.get<string>('GENESIS_ADDRESS');
    if (!address) {
      throw new Error(
        'Genesis address is invalid in the environment variables.',
      );
    }

    try {
      const addressArray = JSON.parse(address);

      if (
        !Array.isArray(addressArray) ||
        !addressArray.every((item) => typeof item === 'string')
      ) {
        throw new Error('GENESIS ADDRESS must be a JSON array of strings.');
      }

      return addressArray;
    } catch (error) {
      throw new Error(
        `Failed to parse GENESIS ADDRESS: ${error.message}. Ensure it is a valid JSON array.`,
      );
    }
  }

  get rabbitmq() {
    const rabbitmqUrl = this.get<string>('RABBITMQ_URL') || 'amqp://localhost';
    return {
      url: rabbitmqUrl,
    };
  }

  get relay() {
    const relay = this.get<string>('RELAY_URL');
    const relay_test = this.get<string>('RELAY_STAGING');

    return { relay, relay_test };
  }

  get redisUrl(): string {
    return this.get('REDIS_URL');
  }

  get telegramBotToken(): string {
    return this.get('TELEGRAM_BOT_TOKEN');
  }
}
