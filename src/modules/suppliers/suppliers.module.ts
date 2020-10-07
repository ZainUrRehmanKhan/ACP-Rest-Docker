import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SuppliersSchema } from '../../data/schemas/suppliers.schema';
import { MulterModule } from '@nestjs/platform-express';
import { PersonsModule } from '../persons/persons.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    PersonsModule,
    MongooseModule.forFeature([
      {
        name: 'suppliers',
        schema: SuppliersSchema
      }
    ]),
    MulterModule.register({
      dest: '../uploads',
    }),
    ProductsModule
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService]
})
export class SuppliersModule {}
