import { HttpModule, Module } from '@nestjs/common';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonsSchema } from 'src/data/schemas/persons.schema';
import { MulterModule } from '@nestjs/platform-express';
import { ForgotPasswordSchema } from '../../data/schemas/forgotPassword.Schema';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'persons',
        schema: PersonsSchema
      },
      {
        name: 'forgotpassword',
        schema: ForgotPasswordSchema
      }
    ]),
    MulterModule.register({
      dest: '../uploads',
    }),
    ProductsModule,
    HttpModule
  ],
  controllers: [PersonsController],
  providers: [PersonsService],
  exports: [PersonsService]
})
export class PersonsModule {}
