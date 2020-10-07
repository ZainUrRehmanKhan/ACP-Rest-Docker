import { Schema } from 'mongoose';

export const ProductVariantSchema = new Schema({
  color : {
    type: String,
    required: true
  },
  storage : {
    type : String,
    required: false
  },
  version : {
    type : String,
    required: false
  },
  ram : {
    type : String,
    required: false
  },
  price : {
    type : String,
    required: true
  }
})