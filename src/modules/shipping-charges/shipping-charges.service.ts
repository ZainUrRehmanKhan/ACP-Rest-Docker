import { Injectable } from '@nestjs/common';
import { SimpleService } from '../../common/lib/simple.service';
import { ISubcategories } from '../../data/interfaces/subCategories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { IShippingCharges } from '../../data/interfaces/shipping-charges-interface';

@Injectable()
export class ShippingChargesService extends  SimpleService<IShippingCharges> {
  constructor(@InjectModel('shippingCharges') protected readonly model : Model<IShippingCharges>) {
    super(model);
  }

}
