import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ApiPromise, Keyring, SubmittableResult, WsProvider } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { Erc20Service } from './erc20.service.js';

const SUBSTRATE_URL = 'ws://127.0.0.1:9944'

@Injectable()
export class RuntimeService implements OnModuleInit, Erc20Service {
  private api: ApiPromise;
  private alice: KeyringPair;

  async onModuleInit() {
    Logger.log('Connecting to substrate chain...');
    const wsProvider = new WsProvider(SUBSTRATE_URL);
    this.api = await ApiPromise.create({
      provider: wsProvider,
      types: {
        "Address": "AccountId",
        "LookupSource": "AccountId"
      }
    });

    await this.api.isReady;

    const keyring = new Keyring({ type: 'sr25519' });
    this.alice = keyring.addFromUri('//Alice', { name: 'Alice default' });
  }

  async transfer(to: string, value: number) {
    await this.api.tx.templateModule.transfer(to, value).signAndSend(this.alice, (result: SubmittableResult) => { Logger.log(result) })
  }

  async balanceOf(who: string) {
    const result = await this.api.query.templateModule.balances(who)
    return result
  }

  async totalSupply() {
    const result = await this.api.query.templateModule.totalSupply()
    return result
  }

  async allowance(owner: string, spender: string) {
    const result = await this.api.query.templateModule.allowances(owner, spender)
    return result
  }

  async approve(spender: string, value: number) {
    await this.api.tx.templateModule.approve(spender, value).signAndSend(this.alice, (result: SubmittableResult) => { Logger.log(result) })
  }

  async transferFrom(from: string, to: string, value: number) {
    await this.api.tx.templateModule.transferFrom(from, to, value).signAndSend(this.alice, (result: SubmittableResult) => { Logger.log(result) })
  }

}