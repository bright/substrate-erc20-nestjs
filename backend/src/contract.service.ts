import { Injectable } from '@nestjs/common';

@Injectable()
export class ContractService {
  getHello(): string {
    return 'Hello contract!';
  }
}
