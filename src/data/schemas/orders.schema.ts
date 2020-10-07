import { Schema } from 'mongoose';
import { ShippingChargesSchema } from './shipping-charges-schema';
import { ProductsSchema } from './products.schema';

export const OrdersSchema = new Schema({
  orderNo : {
    type: String,
    required: true,
    unique: true
  },
  suppliers: [{
    type: Schema.Types.ObjectId,
    ref: 'suppliers',
    required: false
  }],
  person : {
    type: Schema.Types.ObjectId,
    ref: 'persons',
    required: true
  },
  items : [
    {
    type : new Schema({
      product : ProductsSchema,
      count : Number,
      varient : {
        type: Object
      }
    })
  }],
  outletName : {
    type: String,
    required: false
  },
  coupon : {
    type: Schema.Types.ObjectId,
    ref: 'coupons',
    required: false
  },
  status: {
    type: String,
    default: 'Pending'
  },
  total: {
    type: Number,
    required: true
  },
  orderAmount: {
    type: Number,
    required: true,
  },
  orderType: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  walletAmountUsed : {
    type: Number,
    default: 0,
  },
  note: {
    type: String,
    required: false,
  },
  shipping: {
    type: ShippingChargesSchema
  },
  remarks: {
    type: String,
    required: false
  },
  reason: {
    type: String,
    required:false
  },
  showToSupplier: {
    type: Boolean,
    required: false,
    default: false
  }
},{
  timestamps: true
});
