import { Injectable } from '@nestjs/common';
import { SimpleService } from '../../common/lib/simple.service';
import { IProductUnverified } from '../../data/interfaces/products-unverified.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsUnverifiedService extends SimpleService<IProductUnverified>{
  constructor(@InjectModel('products-unverified') protected readonly model: Model<IProductUnverified>) {
    super(model);
  }

  async fetch(id?: string): Promise<IProductUnverified[] | IProductUnverified> {
    if (id) return await this.model.findById(id).exec()
    return await this.model.find().sort({createdAt: -1}).exec()
  }

  async fetchBySupplier(id: string): Promise<IProductUnverified[]>{
    return await this.model.find({supplierId: id}).exec()
  }

  async remove(data: any): Promise<any>{
    return await this.model.remove(data).exec()
  }
}
