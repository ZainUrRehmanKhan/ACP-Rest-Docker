import  {Schema} from 'mongoose';

export const MasterCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: Boolean,
    required: false
  }
});