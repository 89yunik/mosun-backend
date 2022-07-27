import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiservice: ApiService) {}
  @Get()
  getApiMain(): string {
    return this.apiservice.getApiMain();
  }
}
