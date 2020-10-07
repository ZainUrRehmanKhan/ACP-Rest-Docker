import { Controller } from '@nestjs/common';
import { ISupplierRegistrationRequests } from '../../data/interfaces/supplier-registration-requests.interface';
import { SupplierRegistrationRequestsService } from './supplier-registration-requests.service';
import { SimpleController } from '../../common/lib/simple.controller';

@Controller('supplier-registration-requests')
export class SupplierRegistrationRequestsController extends SimpleController<ISupplierRegistrationRequests> {
  constructor(protected readonly service: SupplierRegistrationRequestsService) {
    super(service);
  }
}
