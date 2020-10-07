import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IProduct } from '../../data/interfaces/product.interface';
import { MultiImageController } from '../../common/lib/multi-image.controller';
import { IProductUnverified } from '../../data/interfaces/products-unverified.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductsController extends MultiImageController<IProduct> {
  constructor(
    protected readonly service : ProductsService
  )
  {
    super(service);
  }

  @Get('search')
  search(@Query() query:any) {
    return this.service.search(query.name)
  }

  @Get('category')
  productsByCat(@Query() query: string): Promise<IProduct[]>{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (query.name)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      { // @ts-ignore
        return this.service.productsByCat(query.sub, query.name);
      }
    else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return this.service.productsByCat(query.sub, query.main);
    }
  }

  @Get('killer-deals')
  killerDeals(){
    return this.service.getKillerDeals();
  }

  @Get('featured')
  featured(){
    return this.service.getFeatured();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected parseData(document: any) {
    if (document.varientName) {
      let option = []
      if (Array.isArray(document.optionName)) {
        for (let i = 0; i < document.optionName.length; i++) {
          option[i] = {
            optionName: document.optionName[i],
            optionValues: document.optionValues[i],
            optionImages: Array.isArray(document.optionImages)? document.optionImages[i] != null?  document.optionImages[i]: null : document.optionImages
          }
        }
      }
      else {
        if (document.optionImages){
          option[0] = {
            optionName: document.optionName,
            optionValues: document.optionValues,
            optionImages: document.optionImages
          }
        }
      }
      document.options = option

      const pricing = []
      if (Array.isArray(document.varientName)) {
        const forPrice = [];
        for (let i = 0; i < document.varientName.length; ++i) {
          const data = document.varientName[i].includes('/')
            ? document.varientName[i].split('/')
            : document.varientName[i]

          if (+document.varientPrice[i] != 0)
            forPrice.push(+document.varientPrice[i])

          const pricingObj = {}
          if (Array.isArray(document.optionName)){
            if (Array.isArray(data)){
              for (let j = 0; j < data.length; ++j)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                { // @ts-ignore
                  pricingObj[document.optionName[j]] = data[j]
                }
            }
            else
              pricingObj[document.optionName] = data
          }
          else {
            if (Array.isArray(data)){
              for (let j = 0; j < data.length; ++j)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                { // @ts-ignore
                  pricingObj[document.optionName] = data[j]
                }
            }
            else
              pricingObj[document.optionName] = data
          }

          pricingObj['price'] = document.varientPrice[i]
          pricing.push(pricingObj)
        }
        document.priceRange = Math.min(...forPrice)
      }
      else {
        const priceObj = {}
        const data = document.varientName.includes('/')
          ? document.varientName.split('/')
          : document.varientName

        if (Array.isArray(document.optionName)){
          if (Array.isArray(data)) {
            for (let j = 0; j < data.length; j++)
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              { // @ts-ignore
                priceObj[document.optionName[j]] = data[j]
              }
          } else {
            priceObj[document.optionName] = data
          }
        }else {
          if (Array.isArray(data)) {
            for (let j = 0; j < data.length; j++)
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              { // @ts-ignore
                priceObj[document.optionName] = data[j]
              }
          } else {
            priceObj[document.optionName] = data
          }
        }

        priceObj['price'] = document.varientPrice
        document.priceRange = document.varientPrice
        pricing.push(priceObj)
      }

      document.varient = pricing
    }
    else {
      document.varient = []
      document.options = []
    }
    return document
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('images'))
  post(@UploadedFiles() files, @Body() data:any){
    data = this.parseData(data)
    return super.post(files, data);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('images'))
  patch(@UploadedFiles() files, @Body() data:any){
    data = this.parseData(data)
    return super.patch(files, data);
  }

  @Patch('approve')
  @UseGuards(AuthGuard('jwt'))
  approve(@Body() data : string): Promise<IProduct>{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.service.approveProduct(data._id, data.adminCommission);
  }

  @Get('count')
  @UseGuards(AuthGuard('jwt'))
  async count(): Promise<number>{
    return await this.service.count();
  }

  @Get('getbyparent')
  async getByParent(@Query() data: any): Promise<IProduct[]>{
    return await this.service.getByParent(data)
  }

  @Get('supplier-products/:id')
  async getBySupplier(@Param('id') id: string): Promise<IProduct[]>{
    return await this.service.getBySupplier(id);
  }

  @Get('approve/supplier/:id')
  async getByStatus(@Param('id') id: string): Promise<IProduct[] | IProductUnverified[]>{
    return await this.service.getByStatus(id, 'approve');
  }

  @Get('unapproved/supplier/:id')
  async getUnverifiedProducts(@Param('id') id: string): Promise<IProduct[] | IProductUnverified[]>{
    return await this.service.getByStatus(id, 'unapproved');
  }

  @Get('shared-product/:id')
  async getSharedProductDetails(@Param('id') id: string): Promise<any>{
    return await this.service.fetch(id);
  }
}
