import { Module } from '@nestjs/common';
import { ShippingChargesController } from './shipping-charges.controller';
import { ShippingChargesService } from './shipping-charges.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingChargesSchema } from '../../data/schemas/shipping-charges-schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: "shippingCharges",
      schema: ShippingChargesSchema
    }])
  ],
  controllers: [ShippingChargesController],
  providers: [ShippingChargesService]
})
export class ShippingChargesModule {}
