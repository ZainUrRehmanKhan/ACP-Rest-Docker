import  {Schema} from 'mongoose';
import { ImagesSchema } from './images.schema';

export const AdsSchema = new Schema({
  image: ImagesSchema,
  title: String,
  status: Boolean,
},{
  timestamps: true
});