import  {Document} from 'mongoose';

export interface IShippingCharges extends Document{
  location: string,
  charges: number
}