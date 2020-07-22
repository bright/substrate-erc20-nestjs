import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ApiPromise, Keyring, SubmittableResult, WsProvider } from '@polkadot/api';
import { Abi, PromiseContract } from '@polkadot/api-contract';
import { ContractCallOutcome } from '@polkadot/api-contract/types';
import { KeyringPair } from '@polkadot/keyring/types';
import metadata from "./metadata.json";

const SUBSTRATE_URL = 'ws://127.0.0.1:9944'
const ERC20 = '5DhP1rd5AEZCeZY77Zttbt293rX6tX4QnqEajEMd5i1QKsnB'
const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'

@Injectable()
export class ContractService implements OnModuleInit {
  private api: ApiPromise;
  private abi: Abi;
  private alice: KeyringPair;
  private apiContract: PromiseContract;

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

    const abiJSONobj = (<any>metadata);
    this.abi = new Abi(this.api.registry, abiJSONobj);
    this.apiContract = new PromiseContract(this.api, this.abi, ERC20);

    await this.api.isReady;

    const keyring = new Keyring({ type: 'sr25519' });
    this.alice = keyring.addFromUri('//Alice', { name: 'Alice default' });
  }

  async transfer(to: string, value: number) {
    await this.api.tx.contracts.call(ERC20, 0, 1000000000000, this.abi.messages.transfer(to, value))
      .signAndSend(this.alice, (result: SubmittableResult) => { Logger.log(result) })
  }

  async balanceOf(who: string) {
    const result: ContractCallOutcome = await this.apiContract.call('rpc', 'balanceOf', 0, 1000000000000, who)
      .send(ALICE) as ContractCallOutcome
    return result.output.toString()
  }

  async totalSupply() {
    const result: ContractCallOutcome = await this.apiContract.call('rpc', 'totalSupply', 0, 1000000000000)
      .send(ALICE) as ContractCallOutcome
    return result.output.toString()
  }

}