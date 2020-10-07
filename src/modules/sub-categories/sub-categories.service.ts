import { Injectable } from '@nestjs/common';
import { SimpleService } from '../../common/lib/simple.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISubcategories } from '../../data/interfaces/subCategories.interface';

@Injectable()
export class SubCategoriesService extends  SimpleService<ISubcategories> {
  constructor(@InjectModel('sub-categories') protected readonly model : Model<ISubcategories>) {
    super(model);
  }

  async getByParent(id: string){
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await this.model.find({parents: id, status: true}).exec()
  }
}
