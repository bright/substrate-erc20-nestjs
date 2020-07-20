import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ApiPromise, Keyring, SubmittableResult, WsProvider } from '@polkadot/api';
import { Abi } from '@polkadot/api-contract';
import { KeyringPair } from '@polkadot/keyring/types';
import metadata from "./metadata.json";


const SUBSTRATE_URL = 'ws://127.0.0.1:9944'
const ERC20 = '5DhP1rd5AEZCeZY77Zttbt293rX6tX4QnqEajEMd5i1QKsnB'


@Injectable()
export class BalancesService implements OnModuleInit {
  private api: ApiPromise;
  private abi: Abi;
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

    const abiJSONobj = (<any>metadata);
    this.abi = new Abi(this.api.registry, abiJSONobj);

    // assume Alice is always the user  
    const keyring = new Keyring({ type: 'sr25519' });
    this.alice = keyring.addFromUri('//Alice', { name: 'Alice default' });
    
  }

  async transfer(to: string, value: number) {
    await this.api.isReady;

    const txHash = await this.api.tx.contracts.call(ERC20,
      0, 1000000000000,
      this.abi.messages.transfer(to, value)
    ).signAndSend(this.alice, (result: SubmittableResult) => { Logger.log(result) })

    return txHash;
  }

  async balanceOf(who: string) {
    await this.api.isReady;
    // works but cannot get the answer
    const result = await this.api.rpc.contracts.call(
      {
        dest: ERC20,
        value: 0,
        gasLimit: 1000000000000,
        inputData: this.abi.messages.balanceOf(who)
      })

    return result.isSuccess;
  }

  async totalSupply() {
    await this.api.isReady;
    // works but cannot get the answer
    const result = await this.api.rpc.contracts.call(
      {
        dest: ERC20,
        value: 0,
        gasLimit: 1000000000000,
        inputData: this.abi.messages.totalSupply()
      })

    return result.isSuccess;
  }
}