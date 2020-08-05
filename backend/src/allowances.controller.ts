import { Body, Controller, Get, HttpCode, Inject, Post, Query } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ContractService } from './contract.service';
import { Erc20 } from './erc20.interface';
import { ACCOUNTS } from './polkadot-api.service';
import { RuntimeService } from './runtime.service';

interface AllowanceDto {
  spender: string,
  value: number,
}

@Controller(':token/allowances')
export class AllowancesController {
  tokenService: Erc20;
  constructor(@Inject(REQUEST) private readonly request: Request, private readonly runtimeService: RuntimeService, private readonly contractService: ContractService) {
    this.tokenService = request.params.token === 'runtime' ? runtimeService : contractService;
  }

  @Get()
  async allowance(@Query('owner') owner: string, @Query('spender') spender: string): Promise<string> {
    const data = await this.tokenService.allowance(ACCOUNTS[owner], ACCOUNTS[spender]);
    return `${data}`;
  }

  @Post()
  @HttpCode(202)
  async approve(@Body() allowanceDto: AllowanceDto) {
    await this.tokenService.approve(ACCOUNTS[allowanceDto.spender], allowanceDto.value);
  }
}
