import { Body, Controller, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ISupplier } from '../../data/interfaces/supplier.interface';
import { SuppliersService } from './suppliers.service';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { SecuredController } from '../../common/lib/secured.controller';
import { AuthGuard } from '@nestjs/passport';
import any = jasmine.any;
import fs from "fs";
import { join } from "path";
import { doc } from 'prettier';
import { forEachResolvedProjectReference } from 'ts-loader/dist/instances';

@Controller('suppliers')
export class SuppliersController extends SecuredController<ISupplier> {
  constructor(protected readonly service: SuppliersService) {
    super(service)
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async postOverride(@UploadedFiles() files,@Body() data: any): Promise<any> {
    if (files.length != 0){
      data.documents = []
      if (Array.isArray(data.index)){
        for (let i = 0; i< files.length; ++i){
          data.documents.push({
            name: files[i].filename,
            path: files[i].path,
            index: data.index[i],
            expiryDate: data.expiryDate[i]
          })
        }
      }else {
        data.documents.push({
          name: files[0].filename,
          path: files[0].path,
          index: data.index,
          expiryDate: data.expiryDate
        })
      }
    }
    return super.post(data);
  }

  @Patch()
  @UseInterceptors(FilesInterceptor('files'))
  async patchOverride(@UploadedFiles() files,@Body() data: any): Promise<any> {
    let supplier = (await this.service.fetch(data._id)) as ISupplier;
    if (data.deletedIndex){
      if (Array.isArray(data.deletedIndex)){
        for (let index of data.deletedIndex){
          // @ts-ignore
          for (let i = 0; i < supplier.documents.length; ++i){
            // @ts-ignore
            if (+supplier.documents[i].index == +index){
              try {
                fs.unlinkSync(join(process.cwd(), supplier.documents[i].path))
              } catch (e) {
                console.log(e.message)
              }
              supplier.documents.splice(i, 1)
              break;
            }
          }
        }
      }
      else {
        // @ts-ignore
        for (let i = 0; i < supplier.documents.length; ++i){
          // @ts-ignore
          if (+supplier.documents[i].index == +data.deletedIndex){
            try {
              fs.unlinkSync(join(process.cwd(), supplier.documents[i].path))
            } catch (e) {
              console.log(e.message)
            }
            supplier.documents.splice(i, 1)
          }
        }
      }
    }

    if (files.length != 0){
      if (Array.isArray(data.expiryDate)){
        for (let i = 0; i< files.length; ++i){
          supplier.documents.push({
            name: files[i].filename,
            path: files[i].path,
            expiryDate: data.expiryDate[i],
            index: data.index[i]
          })
        }
      }else {
        for (let i = 0; i< files.length; ++i){
          supplier.documents.push({
            name: files[i].filename,
            path: files[i].path,
            expiryDate: data.expiryDate,
            index: data.index[i]
          })
        }
      }
    }
    data.documents = supplier.documents;
    // @ts-ignore
    data.person = supplier.person._id
    return super.patch(data);
  }

  @Get('getbyperson/:id')
  @UseGuards(AuthGuard('jwt'))
  async getByPersonId(@Param('id') id : string): Promise<any>{
    return await this.service.getByPersonId(id);
  }

  @Get('count')
  @UseGuards(AuthGuard('jwt'))
  async count(): Promise<number>{
    return await this.service.count();
  }
}
