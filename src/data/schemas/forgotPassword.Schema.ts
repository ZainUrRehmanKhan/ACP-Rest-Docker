import { Schema } from 'mongoose';

export const ForgotPasswordSchema = new Schema({
  hash : {
    type: String,
    required: true
  },
  email : {
    type: String,
    required: true
  }
}, {timestamps: true})