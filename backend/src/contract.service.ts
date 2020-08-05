import { Injectable, Logger } from '@nestjs/common';
import { SubmittableResult } from '@polkadot/api';
import { ContractCallOutcome } from '@polkadot/api-contract/types';
import { Erc20 } from './erc20.interface';
import { ALICE, ERC20, PolkadotApiService } from './polkadot-api.service';

@Injectable()
export class ContractService implements Erc20 {
  constructor(private readonly polkadotApiService: PolkadotApiService) { }

  async totalSupply() {
    const result: ContractCallOutcome = await this.polkadotApiService.apiContract.call('rpc', 'totalSupply', 0, 1000000000000)
      .send(ALICE) as ContractCallOutcome
    return result.output.toString()
  }

  async balanceOf(who: string) {
    const result: ContractCallOutcome = await this.polkadotApiService.apiContract.call('rpc', 'balanceOf', 0, 1000000000000, who)
      .send(ALICE) as ContractCallOutcome
    return result.output.toString()
  }
  
  async transfer(to: string, value: number) {
    await this.polkadotApiService.api.tx.contracts.call(ERC20, 0, 1000000000000, this.polkadotApiService.abi.messages.transfer(to, value))
      .signAndSend(this.polkadotApiService.alice, (result: SubmittableResult) => { Logger.log(result) })
  }

  async allowance(owner: string, spender: string) {
    const result: ContractCallOutcome = await this.polkadotApiService.apiContract.call('rpc', 'allowance', 0, 1000000000000, owner, spender)
      .send(ALICE) as ContractCallOutcome
    return result.output.toString()
  }

  async approve(spender: string, value: number) {
    await this.polkadotApiService.api.tx.contracts.call(ERC20, 0, 1000000000000, this.polkadotApiService.abi.messages.approve(spender, value))
      .signAndSend(this.polkadotApiService.alice, (result: SubmittableResult) => { Logger.log(result) })
  }

  async transferFrom(from: string, to: string, value: number) {
    await this.polkadotApiService.api.tx.contracts.call(ERC20, 0, 1000000000000, this.polkadotApiService.abi.messages.transferFrom(from, to, value))
      .signAndSend(this.polkadotApiService.alice, (result: SubmittableResult) => { Logger.log(result) })
  }

}