import { Controller, Get, Logger } from '@nestjs/common';
import { ResponseBase, ResponseCode } from 'src/common/base/response.base';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  private readonly startTime: Date;

  constructor() {
    this.startTime = new Date();
  }

  @Get('/server-status')
  async getServerStatus(): Promise<ResponseBase> {
    return new ResponseBase(ResponseCode.SUCCESS, 'OK', {
      serverTime: new Date(),
    });
  }
}
