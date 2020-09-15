import { Body, Controller, Get, HttpCode, Inject, Param, Put, HttpException, HttpStatus } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ContractService } from './contract.service';
import { Erc20 } from './erc20.interface';
import { ACCOUNTS } from './polkadot-api.service';
import { RuntimeService } from './runtime.service';

interface TransferDto {
  sender: string,
  from?: string
  to: string
  value: number
}

@Controller(':service/balances')
export class BalancesController {
  tokenService: Erc20;
  constructor(@Inject(REQUEST) private readonly request: Request, private readonly runtimeService: RuntimeService, private readonly contractService: ContractService) {
    this.tokenService = request.params.service === 'runtime' ? runtimeService : contractService;
  }

  @Get()
  async totalSupply(): Promise<string> {
    const data = await this.tokenService.totalSupply();
    return `${data}`;
  }

  @Get(':id')
  async balanceOf(@Param() params: { id: string }): Promise<string> {
    const data = await this.tokenService.balanceOf(ACCOUNTS[params.id]);
    return `${data}`;
  }

  @Put()
  @HttpCode(202)
  async transfer(@Body() transferDto: TransferDto) {
    try {
      if (transferDto.from !== undefined) {
        await this.tokenService.transferFrom(transferDto.sender, transferDto.from, transferDto.to, transferDto.value);
      }
      else {
        await this.tokenService.transfer(transferDto.sender, transferDto.to, transferDto.value);
      }
    }
    catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }
}
