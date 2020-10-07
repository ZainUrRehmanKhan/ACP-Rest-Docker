import { IPerson } from 'src/data/interfaces/person.interface';
import {
  Body,
  Controller,
  Post,
  Param, Patch, Get, Query, UseGuards,
} from '@nestjs/common';
import { PersonsService } from './persons.service';
import { ImageController } from '../../common/lib/image.controller';
import { ProductsService } from '../products/products.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('persons')
export class PersonsController extends ImageController<IPerson> {
  constructor(protected readonly service: PersonsService,
              protected readonly productsService: ProductsService) {
    super(service)
  }

  @Post('favorite')
  @UseGuards(AuthGuard('jwt'))
  favorite(@Body() data:any){
    return this.service.favoriteProducts(data.personId,data.productId);
  }

  @Patch('admin-changepassword')
  @UseGuards(AuthGuard('jwt'))
  async AdminChangePassword(@Body() data: any): Promise<any>{
    return await this.service.AdminChangePassword(data);
  }

  @Patch('changepassword')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Body() data: any): Promise<any>{
    return  await this.service.changePassword(data);
  }

  @Post('forgotpassword')
  async forgotPassword(@Body() data: any){
    return await this.service.forgotPassword(data.email);
  }

  @Get('verify/:hash')
  async verify(@Param('hash') hash: string): Promise<boolean>{
    return await this.service.verify(hash);
  }

  @Get('guest-favorites')
  async getFavourites(@Query('products') data: any)
  {
    const favorites = [];
    for(let i=0; i<data?.length; ++i){
      try{
        const prod = await this.productsService.fetch(data[i]);
        if (prod){
          favorites.push(prod);
        }
      } catch (e) {

      }
    }
    return favorites
  }

  @Get('user-favorites/:id')
  @UseGuards(AuthGuard('jwt'))
  async userFavorites(@Param('id') id: string): Promise<any>{
    const data = (await this.service.fetch(id)) as IPerson
    const result = []
    for (const item of data.watchList){
      const prod = await this.productsService.fetch(item)
      if (prod)
        result.push(prod)
    }
    return result
  }

  @Post('social-sign-in')
  async socialSignIn(@Body() data: any): Promise<IPerson>{
    return await this.service.socialSignIn(data);
  }

  @Get('customers')
  @UseGuards(AuthGuard('jwt'))
  async getCustomer(): Promise<IPerson[]>{
    return await this.service.getCustomer();
  }
}
