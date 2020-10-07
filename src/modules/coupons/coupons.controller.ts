import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ICoupons } from '../../data/interfaces/coupons.interface';
import { CouponsService } from './coupons.service';
import { SecuredController } from '../../common/lib/secured.controller';
import { AuthGuard } from '@nestjs/passport';

@Controller('coupons')
export class CouponsController extends  SecuredController<ICoupons>{
  constructor(protected readonly service : CouponsService) {
    super(service);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async Post(@Body () data: ICoupons): Promise<ICoupons | string | any> {
    const flag = await this.service.couponExists(data.name);
    if (flag)
      return { error: 'Coupon Already Exists'}

    return super.post(data);
  }

  @Get('apply-coupon/:coupon')
  @UseGuards(AuthGuard('jwt'))
  applyCoupon(@Param ('coupon') coupon:string):  Promise<number | string> {
   return this.service.applyCoupon(coupon);
  }

  @Get('getbyname/:name')
  @UseGuards(AuthGuard('jwt'))
  async getCouponByName(@Param('name') name: string): Promise<ICoupons>{
    return await this.service.getByName(name);
  }
}
