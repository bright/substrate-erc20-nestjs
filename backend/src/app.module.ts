import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';

@Module({
  imports: [],
  controllers: [AppController, ContractController],
  providers: [AppService, ContractService],
})
export class AppModule {}
