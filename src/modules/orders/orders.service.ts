import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SimpleService } from '../../common/lib/simple.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { IOrders } from '../../data/interfaces/orders.interface';
import { ProductsService } from '../products/products.service';
import * as blake2 from 'blake2'
import { CouponsService } from '../coupons/coupons.service';
import { FcmService } from '../fcm/fcm.service';
import { PersonsService } from '../persons/persons.service';

@Injectable()
export class OrdersService extends SimpleService<IOrders>{
  constructor(
    @InjectModel('orders')
    protected readonly model: Model<IOrders>,
    private readonly productsService: ProductsService,
    private readonly couponService : CouponsService,
    protected readonly fcmService : FcmService,
    protected readonly personsService: PersonsService
  )
  {
    super(model);
  }

 async fetch(id?: string): Promise<IOrders[] | IOrders> {
    if(id) return await this.model.findById(id).populate('person').populate('coupon').sort({createdAt: -1}).exec();
    else return await this.model.find().populate('person').populate('coupon').sort({createdAt: -1}).exec();
 }

 //Dashboard
  async count(): Promise<any>{
    const c = await this.model.find({status: 'Delivered'}).countDocuments().exec()
    let revenue = 0;
    const data = (await this.model.find({status: 'Delivered'})) as IOrders[];
    for (const item of data){
      revenue += item.total
    }
    return {
      orders : c,
      revenue : revenue
    }
  }

  async getByStatus(id: string, status: string): Promise<IOrders[]>{
    return  await this.model.find({person: id, status}).populate('person').populate('coupon').sort({createdAt: -1}).exec()
  }

  async updateByStatus(id: string, status: string, reason? : string): Promise<any>{
    let order = await this.model.findById(id).exec()

    if (await this.model.findByIdAndUpdate(id, { status, reason}).exec()){

      if (status == 'Delivered'){
        if (order.status == 'Cancelled' || order.status == 'Cancelled by Customer'){
          if (order.walletAmountUsed != 0){
            await this.personsService.addingWalletPoints(order.person.toString(), order.walletAmountUsed, false);
            await this.personsService.addingWalletPoints(order.person.toString(), order.total, true);
          }else {
            await this.personsService.addingWalletPoints(order.person.toString(), order.total, true);
          }
        }
        else {
          await this.personsService.addingWalletPoints(order.person.toString(), order.total, true);
        }
      }
      else if(status == 'Cancelled' || status == 'Cancelled by Customer'){
        if (order.walletAmountUsed != 0){
          //add wallet points again
          await this.personsService.addingWalletPoints(order.person.toString(), order.walletAmountUsed, true);
          //remove order order wallet point if from delivered to cancellation
          if (order.status == 'Delivered'){
            await this.personsService.addingWalletPoints(order.person.toString(), order.total, false);
          }
        }
        else {
          //remove order points
          if (order.status == 'Delivered'){
            await this.personsService.addingWalletPoints(order.person.toString(), order.total, false);
          }
        }
      }

      order = await this.model.findById(id).exec()
      await this.personsService.sendSingle(order.person.toString(), "Your Order is "+status);
      return order
    }
    else {
      throw new HttpException(
        "can't update order status!",
        HttpStatus.NOT_ACCEPTABLE
      )
    }
  }

  //Dashboard
  async getAll(id: string): Promise<any>{
    const pending = await this.getByStatus(id, 'Pending')
    const completed = await this.getByStatus(id, 'Delivered')
    const cancelled = await this.getByStatus(id, 'Cancelled')
    const cancelled_by_customer = await this.getByStatus(id, 'Cancelled by Customer')
    const onhold = await this.getByStatus(id, 'On Hold')
    const processing = await this.getByStatus(id, 'Processing')
    return {
      pending : pending,
      completed : completed,
      cancelled : cancelled,
      onhold : onhold,
      processing : processing,
      cancelled_by_customer : cancelled_by_customer
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected getRandomArbitrary() {
    return (Math.random() * (999999 - 100000) + 100000).toFixed(0);
  }

  async create(document: IOrders): Promise<IOrders> {
    let code = this.getRandomArbitrary();
    code = code+Date.now().toString()
    const h = blake2.createHash('blake2b', {digestLength: 3});
    h.update(Buffer.from(code));
    document.orderNo = h.digest("hex");

    if (document.coupon){
      await this.couponService.increamentCouponUsage(document.coupon.toString());
    }

    const order = super.create(document);
    if (document.walletAmountUsed != 0){
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await this.personsService.addingWalletPoints(document.person, document.walletAmountUsed, false);
    }
    // else {
    //   eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   @ts-ignore
      // await this.personsService.addingWalletPoints(document.person, document.total, true);
    // }
    return order
  }

  async remarks(data: any): Promise<any>{
    const order = await this.model.findByIdAndUpdate(data.id, {remarks: data.remarks}).exec()
    await this.personsService.sendSingle(order.person.toString(), data.remarks);
    return order
  }

  async getBySupplierId(id: string): Promise<any>{
    const orders = await this.model.find({showToSupplier: true}).populate('person').populate('coupon').sort({createdAt: -1}).exec()
    let results = new Set();
    for (let item of orders){
      for (let index of item.items){
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (index.product.supplierId == id){
          results.add(item)
        }
      }
    }
    return Array.from(results)
  }
}
