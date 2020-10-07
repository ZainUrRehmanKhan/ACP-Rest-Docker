import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SimpleService } from './simple.service'
import { Document } from 'mongoose'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport';

export abstract class ImageController<T extends Document> {
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
  @UseInterceptors(FileInterceptor('image'))
  post(@UploadedFile('file') file, @Body() data: T): Promise<T> {
    if (file) {
      // @ts-ignore
      data.image = {
        name: file.filename,
        path: file.path
      }
    }

    return this.service.create(data)
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  patch(@UploadedFile() file, @Body() data: T): Promise<T> {
    // @ts-ignore
    if (file != null) {
      // @ts-ignore
      data.image = {
        name: file.filename,
        path: file.path
      }
    }
    return this.service.change(data)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string): Promise<Document> {
    return this.service.remove(id)
  }
}
