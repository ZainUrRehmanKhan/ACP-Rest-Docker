import {Schema} from 'mongoose';

export const MainCategorySchema = new Schema({
  name: {
    type:String,
    required: true,
    unique: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'master-categories',
    required: true
  },
  status: {
    type : Boolean,
    default: true
  }
});