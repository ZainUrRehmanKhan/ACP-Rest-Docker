import { Module } from '@nestjs/common';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdsSchema } from '../../data/schemas/ads.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: "ads",
      schema: AdsSchema
    }]),
    MulterModule.register({
      dest: '../uploads',
    })
  ],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule {}
