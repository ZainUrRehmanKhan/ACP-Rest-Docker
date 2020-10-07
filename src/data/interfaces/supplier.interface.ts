import { IPerson } from './person.interface';
import { Document} from 'mongoose';

export interface ISupplier extends Document {
  person: IPerson | string
  status: boolean,
  companyName: string,
  documents: [{
    name: string,
    path: string,
    expiryDate: string,
    index: string
  }],
}
