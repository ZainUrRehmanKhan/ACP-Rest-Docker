import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimpleService } from 'src/common/lib/simple.service';
import { ISupplier } from '../../data/interfaces/supplier.interface';
import { PersonsService } from '../persons/persons.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SuppliersService extends SimpleService<ISupplier> {
  constructor(
    @InjectModel('suppliers')
    protected readonly model: Model<ISupplier>,
    private readonly personsService: PersonsService,
    private readonly productsService: ProductsService
  ) {
    super(model)
  }

  async create(supplier: any): Promise<ISupplier> {
    supplier.scope = ['supplier']
    supplier.person = await this.personsService.create(supplier)
    return super.create(supplier);
  }

  async fetch(id?: string): Promise<ISupplier[] | ISupplier> {
    if (id) return await this.model.findById(id).populate('person').exec()
    return await this.model.find().populate('person').exec();
  }

  async getByPersonId(id: string): Promise<any>{
    return await this.model.findOne({person: id}).exec()
  }

  async change(document: any): Promise<ISupplier> {
    if (document.status == false){
      await this.productsService.inactiveProductsBySuppliers(document._id);
    }
    const supplierId = document._id
    document._id = document.person
    await this.personsService.change(document)
    document._id = supplierId
    return super.change(document);
  }

  async count(): Promise<number>{
    return await this.model.find().countDocuments().exec()
  }

  async remove(id?: string): Promise<any> {
    await this.personsService.remove((await this.model.findById(id).exec() as ISupplier).person.toString())
    return await super.remove(id);
  }
}
