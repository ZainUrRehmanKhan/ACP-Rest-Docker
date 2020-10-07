import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { SimpleService } from '../../common/lib/simple.service';
import { ICoupons } from '../../data/interfaces/coupons.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment'

@Injectable()
export class CouponsService extends SimpleService<ICoupons>{
  constructor(@InjectModel ('coupons') protected readonly model : Model<ICoupons>) {
    super(model);
  }

  async couponExists(coupon: string): Promise<boolean>{
    return !!(await this.model.findOne().where('name', coupon).exec());
  }

  async getByName(name: string): Promise<ICoupons>{
    return await this.model.findOne({name}).exec()
  }

  async applyCoupon(name: string): Promise<any> {
    const _coupon: ICoupons = await this.getByName(name);

    if(_coupon && _coupon.oneTimeUse && _coupon.usage > 0){
      throw new HttpException(
        'You Coupon Has Expired!',
        HttpStatus.NOT_ACCEPTABLE
      )
    }
    else if(_coupon){
      return {
        discount: _coupon.discount,
        isValid: moment().diff(_coupon.endDate, 'days') <= 0,
        _id : _coupon._id
      }
    }
    else
      throw new HttpException(
        'Coupon is invalid!',
        HttpStatus.NOT_ACCEPTABLE
      )

  }

  async increamentCouponUsage(id: string){
    let coupon = await this.model.findById(id).exec()
    coupon.usage++
    return await this.model.findByIdAndUpdate(id, coupon).exec()
  }
}
