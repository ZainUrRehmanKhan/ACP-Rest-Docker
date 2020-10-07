import { Schema } from 'mongoose';
import { ImagesSchema } from './images.schema';

export const ProductsUnverifiedSchema = new Schema({
  supplierId : {
    type: Schema.Types.ObjectId,
    default: null,
    reference: 'suppliers',
    required: false
  },
  masterCategoryId : {
    type: Schema.Types.ObjectId,
    ref: 'master-categories',
    required: false
  },
  mainCategoryId : {
    type: Schema.Types.ObjectId,
    ref: 'main-categories',
    required: true
  },
  subCategoryId : {
    type: Schema.Types.ObjectId,
    ref: 'sub-categories',
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false
  },
  isKillerDeal: {
    type: Boolean,
    default: false
  },
  hideWarranty: {
    type: Boolean,
    default: false,
  },
  warrantyMonths: {
    type: String,
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: false
  },
  priceRange: {
    type: String,
    required: false
  },
  options: [
    {
      optionName: String,
      optionValues: String,
      optionImages: String
    }
  ],
  varient: [Object],
  images: {
    type: [ImagesSchema],
    required: true
  },
  adminCommission: {
    type: Number,
    required: true
  },
  name:{
    type: String,
    index: 'text',
    required: true
  }
},{
  timestamps: true
});
