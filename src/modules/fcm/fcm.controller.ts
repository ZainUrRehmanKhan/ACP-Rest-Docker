import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('fcm')
export class FcmController{
  constructor(
    protected readonly service: FcmService
  )
  {}

  //fcm
  @Post('notification')
  @UseGuards(AuthGuard('jwt'))
  async notification(@Body() data: any){
    return await this.service.notification(data);
  }
}
