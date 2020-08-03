import { Body, Controller, Get, HttpCode, Inject, Post, Query } from '@nestjs/common';
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

interface AllowanceDto {
  spender: string,
  value: number,
}

@Controller(':token/allowances')
export class AllowancesController {
  tokenService: Erc20Service;
  constructor(@Inject(REQUEST) private readonly request: Request, private readonly runtimeService: RuntimeService, private readonly contractService: ContractService) {
    this.tokenService = request.params.token === 'runtime' ? runtimeService : contractService;
  }


  @Get()
  async allowance(@Query('owner') owner: string, @Query('spender') spender: string): Promise<string> {
    const data = await this.tokenService.allowance(accounts[owner], accounts[spender]);
    return `${data}`;
  }

  @Post()
  @HttpCode(202)
  async approve(@Body() allowanceDto: AllowanceDto) {
    console.log(allowanceDto);
    await this.tokenService.approve(accounts[allowanceDto.spender], allowanceDto.value);
  }
}
