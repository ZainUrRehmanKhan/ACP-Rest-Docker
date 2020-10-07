import { Controller } from '@nestjs/common';
import { IMasterCategories } from '../../data/interfaces/masterCategories.interface';
import { MasterCategoriesService } from './master-categories.service';
import { SecuredController } from '../../common/lib/secured.controller';

@Controller('master-categories')
export class MasterCategoriesController extends SecuredController<IMasterCategories>{
  constructor(protected readonly service : MasterCategoriesService) {
    super(service);
  }
}
