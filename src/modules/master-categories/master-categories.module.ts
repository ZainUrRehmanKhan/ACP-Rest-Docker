import { Module } from '@nestjs/common';
import { MasterCategoriesController } from './master-categories.controller';
import { MasterCategoriesService } from './master-categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MasterCategorySchema } from '../../data/schemas/master-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: "master-categories",
      schema: MasterCategorySchema,
    }]),
  ],
  controllers: [MasterCategoriesController],
  providers: [MasterCategoriesService]
})
export class MasterCategoriesModule {}
