import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ISubcategories } from '../../data/interfaces/subCategories.interface';
import { SubCategoriesService } from './sub-categories.service';
import { SecuredController } from '../../common/lib/secured.controller';

@Controller('sub-categories')
export class SubCategoriesController extends  SecuredController<ISubcategories> {
  constructor(protected readonly service : SubCategoriesService) {
    super(service);
  }

  @Get('getbyparent/:id')
  async getByParent(@Param('id') id:string){
    return await this.service.getByParent(id);
  }
}
