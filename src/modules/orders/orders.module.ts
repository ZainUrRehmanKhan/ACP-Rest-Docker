import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersSchema } from '../../data/schemas/orders.schema';
import { ProductsModule } from '../products/products.module';
import { CouponsModule } from '../coupons/coupons.module';
import { FcmModule } from '../fcm/fcm.module';
import { PersonsModule } from '../persons/persons.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: "orders",
      schema: OrdersSchema
    }]),
    ProductsModule,
    CouponsModule,
    FcmModule,
    PersonsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
