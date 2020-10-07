import  {Document} from 'mongoose';

export interface ISubscribers extends Document{
  email: string
}