import { Body, Controller, Get, HttpCode, Inject, Param, Put } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ContractService } from './contract.service';
import { Erc20Service } from './erc20.service';
import { RuntimeService } from './runtime.service';

// accounts list to easily intercact with the API
const accounts = {
  ALICE: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  BOB: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
  CHARLIE: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
  DAVE: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
  EVE: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
}

interface TransferDto {
  from?: string
  to: string
  value: number
}

@Controller(':token/balances')
export class BalancesController {
  tokenService: Erc20Service;
  constructor(@Inject(REQUEST) private readonly request: Request, private readonly runtimeService: RuntimeService, private readonly contractService: ContractService) {
    this.tokenService = request.params.token === 'runtime' ? runtimeService : contractService;
  }

  @Get()
  async totalSupply(): Promise<string> {
    const data = await this.tokenService.totalSupply();
    return `${data}`;
  }

  @Get(':id')
  async balanceOf(@Param() params: { id: string }): Promise<string> {
    const data = await this.tokenService.balanceOf(accounts[params.id]);
    return `${data}`;
  }

  @Put()
  @HttpCode(202)
  async transfer(@Body() transferDto: TransferDto) {
    if (transferDto.from !== undefined) {
      await this.tokenService.transferFrom(accounts[transferDto.from], accounts[transferDto.to], transferDto.value);
    }
    else {
      await this.tokenService.transfer(accounts[transferDto.to], transferDto.value);
    }
  }
}
