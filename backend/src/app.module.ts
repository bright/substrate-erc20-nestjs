import { Module } from '@nestjs/common';
import { AllowancesController } from './allowances.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BalancesController } from './balances.controller';
import { ContractService } from './contract.service';

@Module({
  imports: [],
  controllers: [AppController, BalancesController, AllowancesController],
  providers: [AppService, ContractService],
})
export class AppModule { }
