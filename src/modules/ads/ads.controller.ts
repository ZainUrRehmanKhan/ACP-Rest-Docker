import { Controller } from '@nestjs/common';
import { IAds } from '../../data/interfaces/ads.interface';
import { AdsService } from './ads.service';
import { ImageController } from '../../common/lib/image.controller';

@Controller('ads')
export class AdsController extends ImageController<IAds> {
  constructor(protected readonly service: AdsService) {
    super(service);
  }
}
