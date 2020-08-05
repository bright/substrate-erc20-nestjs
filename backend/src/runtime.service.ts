import { Injectable, Logger } from '@nestjs/common';
import { SubmittableResult } from '@polkadot/api';
import { Erc20 } from './erc20.interface';
import { PolkadotApiService } from './polkadot-api.service';

@Injectable()
export class RuntimeService implements Erc20 {
  constructor(private readonly polkadotApiService: PolkadotApiService) { }

  async totalSupply() {
    const result = await this.polkadotApiService.api.query.erc20.totalSupply()
    return result
  }

  async balanceOf(who: string) {
    const result = await this.polkadotApiService.api.query.erc20.balanceOf(who)
    return result
  }

  async transfer(to: string, value: number) {
    await this.polkadotApiService.api.tx.erc20.transfer(to, value)
      .signAndSend(this.polkadotApiService.alice, (result: SubmittableResult) => { Logger.log(result) })
  }

  async allowance(owner: string, spender: string) {
    const result = await this.polkadotApiService.api.query.erc20.allowance([owner, spender])
    return result
  }

  async approve(spender: string, value: number) {
    await this.polkadotApiService.api.tx.erc20.approve(spender, value)
      .signAndSend(this.polkadotApiService.alice, (result: SubmittableResult) => { Logger.log(result) })
  }

  async transferFrom(from: string, to: string, value: number) {
    await this.polkadotApiService.api.tx.erc20.transferFrom(from, to, value)
      .signAndSend(this.polkadotApiService.alice, (result: SubmittableResult) => { Logger.log(result) })
  }

}