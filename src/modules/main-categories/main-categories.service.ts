import { Injectable } from '@nestjs/common';
import { SimpleService } from '../../common/lib/simple.service';
import { IMainCategories } from '../../data/interfaces/mainCategories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MainCategoriesService extends SimpleService<IMainCategories>{
  constructor(@InjectModel('main-categories') protected readonly model: Model<IMainCategories>) {
    super(model);
  }

  async fetch(id?: string): Promise<IMainCategories[] | IMainCategories> {
    if (id) {
      return await this.model.findOne({ _id: id}).populate('parent').exec()
    }
    else {
      return await this.model.find().populate('parent').exec()
    }
  }

  async getByParentId(id: string): Promise<IMainCategories[]> {
    return await this.model.find({parent: id, status: true}).exec()
  }
}
