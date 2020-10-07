import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribersSchema } from '../../data/schemas/subcribers.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: "subscribers",
      schema: SubscribersSchema
    }]),
    MulterModule.register({
      dest: '../uploads',
    })
  ],
  providers: [SubscribersService],
  controllers: [SubscribersController],
  exports: [SubscribersService]
})
export class SubscribersModule {}
