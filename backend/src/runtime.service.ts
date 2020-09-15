import { Injectable, Logger } from '@nestjs/common';
import { SubmittableResult } from '@polkadot/api';
import { Metadata } from '@polkadot/types';
import { Erc20 } from './erc20.interface';
import { ACCOUNTS, PolkadotApiService } from './polkadot-api.service';

@Injectable()
export class RuntimeService implements Erc20 {
  constructor(private readonly polkadotApiService: PolkadotApiService) { }

  async totalSupply() {
    const result = await this.polkadotApiService.api.query.erc20.totalSupply()
    return result
  }

  async balanceOf(who: string) {
    const result = await this.polkadotApiService.api.query.erc20.balanceOf(ACCOUNTS[who].address)
    return result
  }

  async transfer(sender: string, to: string, value: number) {
    const metadata = await this.polkadotApiService.api.rpc.state.getMetadata() as Metadata;
    await this.polkadotApiService.api.tx.erc20.transfer(ACCOUNTS[to].address, value)
      .signAndSend(ACCOUNTS[sender].pair, async (result: SubmittableResult) => {
        Logger.log(result)
        result.events.forEach(({ event }) => {
          event.data.forEach(async el => {
            const module = el.toJSON()["Module"];
            if (module !== undefined && module.index !== undefined && module.error !== undefined) {
              Logger.log(metadata.asLatest.modules[module.index].name)
              Logger.log(metadata.asLatest.modules[module.index].errors[module.error].name)
              Logger.log(metadata.asLatest.modules[module.index].errors[module.error].documentation)
            }
          })
        })
      })
  }

  async allowance(owner: string, spender: string) {
    const result = await this.polkadotApiService.api.query.erc20.allowance([ACCOUNTS[owner].address, ACCOUNTS[spender].address])
    return result
  }

  async approve(sender: string, spender: string, value: number) {
    await this.polkadotApiService.api.tx.erc20.approve(ACCOUNTS[spender].address, value)
      .signAndSend(ACCOUNTS[sender].pair, (result: SubmittableResult) => { Logger.log(result) })
  }

  async transferFrom(sender: string, from: string, to: string, value: number) {
    await this.polkadotApiService.api.tx.erc20.transferFrom(ACCOUNTS[from].address, ACCOUNTS[to].address, value)
      .signAndSend(ACCOUNTS[sender].pair, (result: SubmittableResult) => { Logger.log(result) })
  }
}