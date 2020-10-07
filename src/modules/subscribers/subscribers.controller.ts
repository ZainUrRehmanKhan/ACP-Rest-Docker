import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ISubscribers } from '../../data/interfaces/subscribers.interface';
import { SubscribersService } from './subscribers.service';
import { AuthGuard } from '@nestjs/passport';
import { SimpleController } from '../../common/lib/simple.controller';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('subscribers')
export class SubscribersController extends  SimpleController<ISubscribers> {
  constructor(protected readonly service : SubscribersService) {
    super(service);
  }

  @Post('sendemail')
  @UseGuards(AuthGuard('jwt'))
  async sendEmail(@Body() data: any): Promise<any>{
    return this.service.sendEmail(data.data, data.title, data.subject);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('image')
  async postImages(@UploadedFile() file: any): Promise<string>{
    return file.filename
  }
}
