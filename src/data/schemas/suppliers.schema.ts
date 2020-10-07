import { Schema } from "mongoose";

export const SuppliersSchema = new Schema({
  person: {
    type: Schema.Types.ObjectId,
    ref: 'persons',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true,
  },
  documents: [
    {
      name: String,
      path: String,
      index: String,
      expiryDate: String
    }
  ]
},{
  timestamps: true
});
