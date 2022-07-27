import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  getApiMain(): string {
    return 'api page';
  }
}
