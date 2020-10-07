import { Module } from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { SubCategoriesController } from './sub-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { subCategoriesSchema } from '../../data/schemas/subCategoriesSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name:'sub-categories', schema:subCategoriesSchema}
    ])
    ],
  providers: [SubCategoriesService],
  controllers: [SubCategoriesController],
  exports: [SubCategoriesService]
})
export class SubCategoriesModule {}
