import { Controller, Get, Param, Post, Put, Body } from '@nestjs/common';
import { BalancesService } from './balances.service';

// accounts list to easily intercact with the API
const accounts = {
  ALICE: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  BOB: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
  CHARLIE: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  DAVE: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
  EVE: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
}

export class TransferDto {
  from?: string
  to: string
  value: number
}

@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get()
  async totalSupply(): Promise<string> {
    console.log('totalSupply')
    const data = await this.balancesService.totalSupply();
    return `${data}`;
  }

  @Get(':id')
  async balanceOf(@Param() params): Promise<string> {
    console.log('balanceof')
    const data = await this.balancesService.balanceOf(accounts[params.id]);
    return `${data}`;
  }

  @Put()
  async transfer(@Body() transferDto: TransferDto): Promise<string> {
    console.log('transfer')
    const data = await this.balancesService.transfer(accounts[transferDto.to], transferDto.value);
    return `${data}`;
  }
}
