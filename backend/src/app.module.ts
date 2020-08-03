import { Module } from '@nestjs/common';
import { AllowancesController } from './allowances.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BalancesController } from './balances.controller';
import { ContractService } from './contract.service';
import { RuntimeService } from './runtime.service';

@Module({
  imports: [],
  controllers: [AppController, BalancesController, AllowancesController],
  providers: [AppService, RuntimeService, ContractService],
})
export class AppModule { }
