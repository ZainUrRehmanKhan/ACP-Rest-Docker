import {Document} from 'mongoose';
import { IMainCategories } from './mainCategories.interface';

export interface ISubcategories extends Document{
  name: string,
  status: boolean,
  parents: IMainCategories[]
}