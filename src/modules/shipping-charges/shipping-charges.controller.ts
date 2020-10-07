import { Controller } from '@nestjs/common';
import { IShippingCharges } from '../../data/interfaces/shipping-charges-interface';
import { ShippingChargesService } from './shipping-charges.service';
import { SecuredController } from '../../common/lib/secured.controller';

@Controller('shipping-charges')
export class ShippingChargesController extends  SecuredController<IShippingCharges> {
  constructor(protected readonly service : ShippingChargesService) {
    super(service);
  }
}
