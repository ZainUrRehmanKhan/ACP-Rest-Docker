import {Document} from 'mongoose';
import { IPerson } from './person.interface';
import { IProduct } from './product.interface';
import { ICoupons } from './coupons.interface';
import { IShippingCharges } from './shipping-charges-interface';
import { ISupplier } from './supplier.interface';

export interface IOrders extends Document{
  orderNo : string,
  suppliers: ISupplier[],
  person: IPerson | string,
  items: [{
    product : IProduct | string,
    count : number,
    varient : {
      storage : string,
      color : string,
      ram: string,
      version : string,
      price : number
    }
  }],
  outletName : string,
  coupon: ICoupons,
  status: string,
  address: string,
  walletAmountUsed: number,
  total: number,
  orderAmount: number,
  orderType: string,
  note: string,
  shipping: IShippingCharges,
  remarks: string
  reason : string
  showToSupplier: boolean
}