import { HttpModule, Module } from '@nestjs/common';
import { FcmController } from './fcm.controller';
import { FcmService } from './fcm.service';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [FcmController],
  providers: [FcmService],
  exports : [FcmService]
})
export class FcmModule {}
