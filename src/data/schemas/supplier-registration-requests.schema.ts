import  {Schema} from 'mongoose';

export const SupplierRegistrationRequestsSchema = new Schema({
  name : {
    type: String,
    required: true
  },
  email : {
    type: String,
    required: true,
    unique: true
  },
  contact : {
    type: String,
    required: true,
    unique: true
  },
  address : {
    type: String,
    required: true
  },
  product : {
    type: String,
    required: true
  },
},{
  timestamps: true
});