import {Document} from 'mongoose';

export interface IMasterCategories extends Document{
  name: string,
  status: boolean
}