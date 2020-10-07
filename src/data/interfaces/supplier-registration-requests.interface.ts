import { Document} from 'mongoose';

export interface ISupplierRegistrationRequests extends Document {
  name: string,
  contact: string,
  email: string,
  address: string,
  product: string
}
