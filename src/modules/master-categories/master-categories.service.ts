import { Injectable } from '@nestjs/common';
import { SimpleService } from '../../common/lib/simple.service';
import { IMasterCategories } from '../../data/interfaces/masterCategories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";

@Injectable()
export class MasterCategoriesService extends SimpleService<IMasterCategories>{
  constructor(
    @InjectModel ('master-categories')
    protected readonly model : Model<IMasterCategories>
  )
  {
    super(model);
  }
}
