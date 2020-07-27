import { Body, Controller, Get, HttpCode, Param, Put } from '@nestjs/common';
import { ContractService } from './contract.service';

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

@Controller('balances')
export class BalancesController {
  constructor(private readonly contractService: ContractService) { }

  @Get()
  async totalSupply(): Promise<string> {
    const data = await this.contractService.totalSupply();
    return `${data}`;
  }

  @Get(':id')
  async balanceOf(@Param() params): Promise<string> {
    const data = await this.contractService.balanceOf(accounts[params.id]);
    return `${data}`;
  }

  @Put()
  @HttpCode(202)
  async transfer(@Body() transferDto: TransferDto) {
    if (transferDto.from !== undefined) {
      await this.contractService.transferFrom(accounts[transferDto.from], accounts[transferDto.to], transferDto.value);
    }
    else {
      await this.contractService.transfer(accounts[transferDto.to], transferDto.value);
    }
  }
}
