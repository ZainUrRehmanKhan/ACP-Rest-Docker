import { Injectable } from '@nestjs/common';
import { SimpleService } from '../../common/lib/simple.service';
import { IAds } from '../../data/interfaces/ads.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";

@Injectable()
export class AdsService extends SimpleService<IAds> {
  constructor(@InjectModel ('ads') protected readonly model : Model<IAds>) {
    super(model);
  }
}
