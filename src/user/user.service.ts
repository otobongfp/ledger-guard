import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class UserService {
  private redis = new Redis();

  async getUser(publicKey?: string, email?: string): Promise<any> {
    if (!publicKey && !email) {
      throw new Error('Either publicKey or email must be provided');
    }

    if (publicKey) {
      const userKey = `users:${publicKey}`;
      const userData = await this.redis.get(userKey);
      if (!userData) throw new Error('User not found');
      return JSON.parse(userData);
    }

    if (email) {
      const keys = await this.redis.keys('users:*');
      for (const key of keys) {
        const userData = await this.redis.get(key);
        const user = JSON.parse(userData);
        if (user.email === email) {
          return user;
        }
      }
      throw new Error('User not found');
    }
  }

  async registerUser(publicKey: string, email: string): Promise<void> {
    const pendingKey = `pending:users:${publicKey}`;
    const userData = { publicKey, email, role: 'intern', approved: false };
    await this.redis.set(pendingKey, JSON.stringify(userData));
  }

  async getPendingUsers(): Promise<any[]> {
    const keys = await this.redis.keys('pending:users:*');
    const users = await Promise.all(keys.map((key) => this.redis.get(key)));
    return users.map((user) => JSON.parse(user));
  }

  async approveUser(publicKey: string): Promise<void> {
    const pendingKey = `pending:users:${publicKey}`;
    const userKey = `users:${publicKey}`;

    const userData = await this.redis.get(pendingKey);
    if (!userData) throw new Error('User not found in pending list');

    const user = JSON.parse(userData);
    user.approved = true;

    await this.redis.set(userKey, JSON.stringify(user));
    await this.redis.del(pendingKey);
  }

  async assignRole(publicKey: string, role: string): Promise<void> {
    const userKey = `users:${publicKey}`;
    const userData = await this.redis.get(userKey);
    if (!userData) throw new Error('User not found');

    const user = JSON.parse(userData);
    user.role = role;

    await this.redis.set(userKey, JSON.stringify(user));
  }
}
