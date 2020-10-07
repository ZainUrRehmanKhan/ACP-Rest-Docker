import {Document} from 'mongoose';

export interface IForgotPassword extends Document{
  hash : string
  email : string
}