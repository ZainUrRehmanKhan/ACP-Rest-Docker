import { Module } from '@nestjs/common';
import { ProductsUnverifiedService } from './products-unverified.service';
import { ProductsUnverifiedController } from './products-unverified.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsUnverifiedSchema } from '../../data/schemas/products-unverified.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MongooseModule.forFeature([{name: 'products-unverified', schema: ProductsUnverifiedSchema}]),
    MulterModule.register({
      dest: '../uploads',
    })
  ],
  providers: [ProductsUnverifiedService],
  controllers: [ProductsUnverifiedController],
  exports: [ProductsUnverifiedService]
})
export class ProductsUnverifiedModule {}
