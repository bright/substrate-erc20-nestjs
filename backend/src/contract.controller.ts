import { Controller, Get } from '@nestjs/common';
import { ContractService } from './contract.service';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  getHello(): string {
    return this.contractService.getHello();
  }
}
