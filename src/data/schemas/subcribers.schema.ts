import  {Schema} from 'mongoose';

export const SubscribersSchema = new Schema({
  email : {
    type: String,
    required: true,
    unique: true
  },
},{
  timestamps: true
});