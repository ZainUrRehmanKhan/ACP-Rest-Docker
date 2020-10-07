import  {Schema} from 'mongoose';

export const ShippingChargesSchema = new Schema({
  location: String,
  charges : Number
},{
  timestamps: true
});