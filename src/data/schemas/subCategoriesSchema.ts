import  {Schema} from 'mongoose';

export const subCategoriesSchema = new Schema({
  name: String,
  status: Boolean,
  parents: [{
    type: Schema.Types.ObjectId,
    ref: 'main-categories',
    required: true
  }]
});