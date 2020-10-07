import {Document } from 'mongoose';
import { IMasterCategories } from './masterCategories.interface';
import { IMainCategories } from './mainCategories.interface';
import { ISubcategories } from './subCategories.interface';
import { IImage } from './image.interface';

export interface IProductUnverified extends Document{
  supplierId: string,
  isFeatured: boolean,
  active: boolean,
  isKillerDeal: boolean,
  hideWarranty: boolean,
  warrantyMonths: string,
  description: string,
  masterCategoryId: IMasterCategories | string,
  mainCategoryId: IMainCategories | string,
  subCategoryId: ISubcategories | string,
  price: number,
  priceRange: string,
  options: [
    {
      optionName: string
      optionValues: string
      optionImages: string
    }
  ]
  // eslint-disable-next-line @typescript-eslint/ban-types
  varient: [object],
  images: IImage[],
  adminCommission: number,
  name: string,
}