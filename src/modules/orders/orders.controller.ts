import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IOrders } from '../../data/interfaces/orders.interface';
import { OrdersService } from './orders.service';
import { SecuredController } from '../../common/lib/secured.controller';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController extends  SecuredController<IOrders> {
  constructor(protected readonly service : OrdersService) {
    super(service);
  }

  @Get('count')
  @UseGuards(AuthGuard('jwt'))
  async count(): Promise<any>{
    return await this.service.count();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  post(data: IOrders): Promise<IOrders> {
    return super.post(data);
  }

  @Patch('updatebystatus')
  @UseGuards(AuthGuard('jwt'))
  async updateByStatus(@Body() data: any): Promise<IOrders[]>{
    if (data.reason)
      return await this.service.updateByStatus(data.id, data.status, data.reason);
    else
      return await this.service.updateByStatus(data.id, data.status);
  }

  @Patch('getbystatus')
  @UseGuards(AuthGuard('jwt'))
  async getByStatus(@Body() data: any): Promise<IOrders[]>{
    return await this.service.getByStatus(data.id, data.status);
  }

  @Get('get-all/:id')
  @UseGuards(AuthGuard('jwt'))
  async getAllByStatus(@Param('id') id: string): Promise<any>{
    return await this.service.getAll(id);
  }

  @Patch('remarks')
  @UseGuards(AuthGuard('jwt'))
  async remarks(@Body() data: any): Promise<IOrders>{
    return await this.service.remarks(data);
  }

  @Get('getbysupplier/:id')
  @UseGuards(AuthGuard('jwt'))
  async getBySupplierId(@Param('id') id: string): Promise<any>{
    return await this.service.getBySupplierId(id);
  }
}
