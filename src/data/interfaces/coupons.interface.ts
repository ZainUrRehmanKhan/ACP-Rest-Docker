import {Document} from 'mongoose';

export interface ICoupons extends Document{
  name: string,
  discount: number,
  startDate: Date,
  endDate: Date,
  oneTimeUse: boolean,
  usage: number
}