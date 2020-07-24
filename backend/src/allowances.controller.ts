import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ContractService } from './contract.service';

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

@Controller('allowances')
export class AllowancesController {
  constructor(private readonly contractService: ContractService) { }

  @Get()
  async allowance(@Query('owner') owner, @Query('spender') spender): Promise<string> {
    const data = await this.contractService.allowance(accounts[owner], accounts[spender]);
    return `${data}`;
  }

  @Post()
  @HttpCode(202)
  async approve(@Body() allowanceDto: AllowanceDto) {
    console.log(allowanceDto);
    await this.contractService.approve(accounts[allowanceDto.spender], allowanceDto.value);
  }
}
