import { Injectable } from '@nestjs/common';
import { IProduct } from '../../data/interfaces/product.interface';
import { SimpleService } from '../../common/lib/simple.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { ProductsUnverifiedService } from '../products-unverified/products-unverified.service';
import { IProductUnverified } from '../../data/interfaces/products-unverified.interface';

@Injectable()
export class ProductsService extends SimpleService<IProduct> {
  constructor(
    @InjectModel('products')
    protected readonly model: Model<IProduct>,
    protected readonly unverifiedProductsService: ProductsUnverifiedService
  )
  {
    super(model)
  }

  async fetch(id?: string): Promise<IProduct[] | IProduct> {
    if (id) return await this.model.findById(id).exec()
    return await this.model.find().sort({createdAt: -1}).exec()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  search(query : string){

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.model.find({'name': { $regex: query, $options: "i" }}).exec();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  productsByCat(sub : string, main: string, query?:string ){
    if (query){
      return this.model.find({active: true, subCategoryId: sub,  $text: {$search: query}}).sort({createdAt: -1}).exec();
    }
    else {
      return this.model.find({active: true, mainCategoryId: main, subCategoryId: sub}).sort({createdAt: -1}).exec();
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getKillerDeals(){
    return this.model.find({active: true}).where('isKillerDeal',true).exec();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getFeatured(){
    return this.model.find({active: true}).where('featured',true).exec();
  }

  async approveProduct(_id: string, adminCommission: string ): Promise<any>{
    const unverifiedProduct = await this.unverifiedProductsService.fetch(_id)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let docProducts = { ...unverifiedProduct._doc }
    docProducts.adminCommission = +adminCommission
    await this.unverifiedProductsService.remove({ _id })

    return await super.create(docProducts)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async inactiveProductsBySuppliers(id: string){
    return await this.model.updateMany({supplierId: id}, {active: false});
  }

  async count(): Promise<number>{
    return await this.model.find().countDocuments().exec()
  }

  async getByParent(data: any): Promise<IProduct[]>{
    switch (data.cat) {
      case 'master':
        return await this.model.find({active: true, masterCategoryId: data.id}).sort({createdAt: -1}).exec()
      case 'main':
        return await this.model.find({active: true, mainCategoryId: data.id}).sort({createdAt: -1}).exec()
      case 'sub':
        return await this.model.find({active: true, subCategoryId: data.id}).sort({createdAt: -1}).exec()
    }
  }

  async getBySupplier(id: string): Promise<IProduct[]>{
    return await this.model.find({supplierId: id}).exec()
  }

  async getByStatus(id: string, status: string): Promise<IProduct[] | IProductUnverified[]>{
    if (status == 'approve')
      return await this.model.find({supplierId: id}).exec()
    else
      return await this.unverifiedProductsService.fetchBySupplier(id);
  }

  async change(document: IProduct): Promise<IProduct> {
    if (document.supplierId != null){
      await this.model.findByIdAndDelete(document._id);
      return await this.unverifiedProductsService.create(document);
    }
    else
      return await super.change(document)
  }
}
