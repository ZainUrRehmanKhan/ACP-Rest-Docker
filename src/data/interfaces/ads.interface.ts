import {Document} from 'mongoose';
import { IImage } from './image.interface';

export interface IAds extends Document{
  image: IImage,
  title: string,
  status: boolean,
}