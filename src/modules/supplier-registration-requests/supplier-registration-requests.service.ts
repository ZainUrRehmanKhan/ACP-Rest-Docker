import { Injectable } from '@nestjs/common';
import { SimpleService } from '../../common/lib/simple.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { ISupplierRegistrationRequests } from '../../data/interfaces/supplier-registration-requests.interface';

@Injectable()
export class SupplierRegistrationRequestsService extends  SimpleService<ISupplierRegistrationRequests> {
  constructor(@InjectModel('supplierRegistrationRequests') protected readonly model : Model<ISupplierRegistrationRequests>) {
    super(model);
  }

}