import { Module } from '@nestjs/common';
import { SupplierRegistrationRequestsService } from './supplier-registration-requests.service';
import { SupplierRegistrationRequestsController } from './supplier-registration-requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplierRegistrationRequestsSchema } from '../../data/schemas/supplier-registration-requests.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: "supplierRegistrationRequests",
      schema: SupplierRegistrationRequestsSchema
    }])
  ],
  providers: [SupplierRegistrationRequestsService],
  controllers: [SupplierRegistrationRequestsController]
})
export class SupplierRegistrationRequestsModule {}
