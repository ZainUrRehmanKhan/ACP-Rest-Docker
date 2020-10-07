import { Body, Controller, Delete, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { MultiImageController } from '../../common/lib/multi-image.controller';
import { IProductUnverified } from '../../data/interfaces/products-unverified.interface';
import { ProductsUnverifiedService } from './products-unverified.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('products-unverified')
export class ProductsUnverifiedController extends MultiImageController<IProductUnverified>{
  constructor(protected readonly service: ProductsUnverifiedService) {
    super(service);
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

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async delete(@Body() data: any): Promise<any> {
    return await this.service.delete(data);
  }
}
