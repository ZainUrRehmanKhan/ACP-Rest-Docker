import { Controller, Get, Param } from '@nestjs/common';
import { IMainCategories } from '../../data/interfaces/mainCategories.interface';
import { MainCategoriesService } from './main-categories.service';
import { SecuredController } from '../../common/lib/secured.controller';

@Controller('main-categories')
export class MainCategoriesController extends SecuredController<IMainCategories>{
  constructor(protected readonly service: MainCategoriesService) {
    super(service);
  }

  @Get('getbyparentid/:id')
  async getByParentId(@Param('id') id: string): Promise<IMainCategories[]>
  {
    return await this.service
      .getByParentId(id);
  }
}
