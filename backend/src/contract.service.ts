import { Injectable, Logger } from '@nestjs/common';
import { SubmittableResult } from '@polkadot/api';
import { ContractCallOutcome } from '@polkadot/api-contract/types';
import { Erc20 } from './erc20.interface';
import { ACCOUNTS, ERC20, PolkadotApiService } from './polkadot-api.service';

@Injectable()
export class ContractService implements Erc20 {
  constructor(private readonly polkadotApiService: PolkadotApiService) { }

  async totalSupply() {
    const result: ContractCallOutcome = await this.polkadotApiService.apiContract.call('rpc', 'totalSupply', 0, 1000000000000)
      .send(ACCOUNTS.ALICE.address) as ContractCallOutcome
    return result.output.toString()
  }

  async balanceOf(who: string) {
    const result: ContractCallOutcome = await this.polkadotApiService.apiContract.call('rpc', 'balanceOf', 0, 1000000000000, ACCOUNTS[who].address)
      .send(ACCOUNTS.ALICE.address) as ContractCallOutcome
    return result.output.toString()
  }

  async transfer(sender: string, to: string, value: number) {
    await this.polkadotApiService.api.tx.contracts.call(ERC20, 0, 1000000000000, this.polkadotApiService.abi.messages.transfer(ACCOUNTS[to].address, value))
      .signAndSend(ACCOUNTS[sender].pair, (result: SubmittableResult) => { Logger.log(result) })
  }

  async allowance(owner: string, spender: string) {
    const result: ContractCallOutcome = await this.polkadotApiService.apiContract.call('rpc', 'allowance', 0, 1000000000000, ACCOUNTS[owner].address, ACCOUNTS[spender].address)
      .send(ACCOUNTS.ALICE.address) as ContractCallOutcome
    return result.output.toString()
  }

  async approve(sender: string, spender: string, value: number) {
    await this.polkadotApiService.api.tx.contracts.call(ERC20, 0, 1000000000000, this.polkadotApiService.abi.messages.approve(ACCOUNTS[spender].address, value))
      .signAndSend(ACCOUNTS[sender].pair, (result: SubmittableResult) => { Logger.log(result) })
  }

  async transferFrom(sender: string, from: string, to: string, value: number) {
    await this.polkadotApiService.api.tx.contracts.call(ERC20, 0, 1000000000000, this.polkadotApiService.abi.messages.transferFrom(ACCOUNTS[from].address, ACCOUNTS[to].address, value))
      .signAndSend(ACCOUNTS[sender].pair, (result: SubmittableResult) => { Logger.log(result) })
  }

}