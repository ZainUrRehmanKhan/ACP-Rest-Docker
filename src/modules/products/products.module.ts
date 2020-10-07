import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsSchema } from '../../data/schemas/products.schema';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsUnverifiedModule } from '../products-unverified/products-unverified.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: 'products',
      schema: ProductsSchema,
    }]),
    MulterModule.register({
      dest: '../uploads',
    }),
    ProductsUnverifiedModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
