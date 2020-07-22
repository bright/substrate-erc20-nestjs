import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BalancesController } from './balances.controller';
import { ContractService } from './contract.service';

@Module({
  imports: [],
  controllers: [AppController, BalancesController],
  providers: [AppService, ContractService],
})
export class AppModule {}
