import {Document} from 'mongoose';

export interface IMainCategories extends Document{
  name: string,
  parent : IMainCategories | string,
  status: boolean,
}