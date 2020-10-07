import { Body, Delete, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { SimpleService } from './simple.service'
import { Document } from 'mongoose'
import { FilesInterceptor } from "@nestjs/platform-express";
import { join } from 'path'
import * as fs from 'fs'
import { AuthGuard } from '@nestjs/passport';
import { ImageConversionUtils } from './image-conversion-utils';
import { createDeflateRaw } from 'zlib';

export abstract class MultiImageController<T extends Document> {
   protected constructor(protected service: SimpleService<T>) {}

   @Get()
   @UseGuards(AuthGuard('jwt'))
   getAll(): Promise<T | T[]> {
      return this.service.fetch()
   }

   @Get(':id')
   @UseGuards(AuthGuard('jwt'))
   get(@Param('id') id: string): Promise<T | T[]> {
      return this.service.fetch(id)
   }

   @Post()
   @UseGuards(AuthGuard('jwt'))
   @UseInterceptors(FilesInterceptor('images'))
   async post(@UploadedFiles() files, @Body() data: any): Promise<T> {
      data.images = []
      data.images = files.map(file => ({
         name: file.filename,
         path: file.path
      }))
      const done = await this.service.create(data)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (files){
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-ignore
         for (const image of files){
            ImageConversionUtils.toWebp(process.cwd()+"\/"+image.path, process.cwd()+"\/..\/uploads\/"+image.filename, 20)
         }
      }
      return done
   }

   @Patch()
   @UseGuards(AuthGuard('jwt'))
   @UseInterceptors(FilesInterceptor('images'))
   async patch(@UploadedFiles() files, @Body() data: any): Promise<T> {

      if (data.deletedImages){
         await this.deleteImage(data.deletedImages)
      }

      let img = []
      if (Array.isArray(data.uploadedImageNames)){
         for (let i=0; i< data.uploadedImageNames.length; ++i){
            img.push({
               name: data.uploadedImageNames[i],
               path: data.uploadedImagePaths[i]
            })
         }
      } else if (data.uploadedImageNames) {
         img.push({
            name : data.uploadedImageNames,
            path : data.uploadedImagePaths
         })
      }

      if (files && files.length > 0) {
         img.push(...files.map(file => ({
            name: file.filename,
            path: file.path
         })))
      }
      data.images = img
      const done = await this.service.change(data)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (files){
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-ignore
         for (const image of files){
            ImageConversionUtils.toWebp(process.cwd()+"\/"+image.path, process.cwd()+"\/..\/uploads\/"+image.filename, 20)
         }
      }
      return done
   }

   private deleteImage(deletedImages: any): string{
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (Array.isArray(deletedImages)){
         for (let i=0;i<deletedImages.length; ++i){
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            try {
               fs.unlinkSync(join(process.cwd(), deletedImages[i]))
            } catch (e) {
               console.log(e.message)
            }
         }
      }
      else {
         try {
            fs.unlinkSync(join(process.cwd(), deletedImages))
         }
         catch(e){
            console.log(e.message)
         }
      }
      return "Images Deleted"
   }

   @Delete(':id')
   @UseGuards(AuthGuard('jwt'))
   async delete(@Param('id') id: string): Promise<Document> {
      const data = await this.service.fetch(id)
      // @ts-ignore
      for (let image of data.images){
         fs.unlinkSync(join(process.cwd(), image.path))
      }
      return this.service.remove(id)
   }
}
