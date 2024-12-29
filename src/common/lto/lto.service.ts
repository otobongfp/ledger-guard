import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import {
  LTO,
  Account,
  Transaction,
  Statement,
  Binary,
  IdentityBuilder,
} from '@ltonetwork/lto';

@Injectable()
export class LTOService {
  private readonly lto: LTO;
  private readonly account: Account;
  private readonly networkId: string;

  constructor(private readonly configService: ConfigService) {
    const { networkId, seed } = this.configService.lto;

    if (!seed) {
      throw new Error('SEED is not defined in the environment variables');
    }

    this.lto = new LTO(networkId);
    this.account = this.lto.account({ seed });
    this.networkId = networkId;
  }

  create() {
    return { account: this.account, lto: this.lto };
  }

  getNetworkId(): string {
    return this.networkId;
  }

  async transfer(recipient: string, amount: number): Promise<Transaction> {
    if (amount <= 0 || !recipient) {
      throw new Error('Invalid amount or recipient');
    }

    const value = amount * 1e8;
    return this.lto.transfer(this.account, recipient, value);
  }

  getAccount(): Account {
    return this.account;
  }

  validateAddress(address: string): boolean {
    return this.lto.isValidAddress(address);
  }

  apiUrl(path: string): string {
    return this.lto.nodeAddress.replace(/\/$/g, '') + path;
  }

  async anchor(
    ...anchors: Array<{ key: Binary; value: Binary }> | Array<Binary>
  ): Promise<void> {
    if (anchors[0] instanceof Uint8Array) {
      await this.lto.anchor(this.account, ...(anchors as Array<Binary>));
    } else {
      await this.lto.anchor(
        this.account,
        ...(anchors as Array<{ key: Binary; value: Binary }>),
      );
    }
  }

  async verifyAnchors(
    ...anchors: Array<{ key: Binary; value: Binary }> | Array<Binary>
  ): Promise<any> {
    const data =
      anchors[0] instanceof Uint8Array
        ? (anchors as Array<Binary>).map((anchor) => anchor.hex)
        : Object.fromEntries(
            (anchors as Array<{ key: Binary; value: Binary }>).map(
              ({ key, value }) => [key.hex, value.hex],
            ),
          );
    const url = this.apiUrl('/index/hash/verify?encoding=hex');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  accountOf(publicKey: Binary | string): string {
    return this.lto.account({
      publicKey: publicKey instanceof Binary ? publicKey.base58 : publicKey,
    }).address;
  }

  createIdentityBuilder(account: Account): IdentityBuilder {
    return new IdentityBuilder(account);
  }

  async broadcast(transaction: Transaction): Promise<void> {
    await this.lto.node.broadcast(transaction);
  }

  async getDIDDocument(did: string): Promise<object> {
    const url = `${this.lto.nodeAddress}/dids/${did}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch DID document for ${did}`);
    }
    return response.json();
  }
}
