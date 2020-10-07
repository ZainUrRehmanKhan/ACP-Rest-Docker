import { Module } from '@nestjs/common';
import { MainCategoriesService } from './main-categories.service';
import { MainCategoriesController } from './main-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MainCategorySchema } from '../../data/schemas/mainCategorySchema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'main-categories', schema: MainCategorySchema}])],
  providers: [MainCategoriesService],
  controllers: [MainCategoriesController],
  exports : [MainCategoriesService]
})
export class MainCategoriesModule {}
