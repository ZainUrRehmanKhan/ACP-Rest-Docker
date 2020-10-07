import { HttpException } from '@nestjs/common'
import { Document, Model } from 'mongoose'
import { ImageConversionUtils } from './image-conversion-utils';

/**
 * @template T
 * @author Arish Khan <arishsultan104@gmail.com>
 */
export abstract class SimpleService<T extends Document> {
  protected constructor(protected readonly model: Model<T>) {}

  /**
   * Fetches Document from the Database
   * ----------------------------------
   *
   * It will return all the documents of this particular collection
   * in case the `id` is not provided.
   *
   * @example
   * // Fetch array of all documents
   * const allDocs = await simpleService.fetch()
   *
   * // Fetch single Document (pass ObjectId of Document).
   * const singleDoc = await simpleService.fetch('5d97e1f...')
   *
   * @param {string} id - ObjectId of existing Document.
   * @returns {Promise<T | T[]>}
   */
  fetch(id?: string): Promise<T | T[]> {
    if (id) return this.model.findById(id).exec()
    return this.model.find().exec()
  }

  /**
   * Creates a new Document in Database
   * ----------------------------------
   *
   * It generates a unique identifier (ObjectId) for each document
   * blake2 algorithm is used for generation of ObjectId. the default
   * ObjectId generation of MongoDB is neglected.
   *
   * @example
   * // Document to be inserted
   * const document = {
   *   // ... fields
   * }
   *
   * simpleService.create(document)
   *
   * @param {T} document - Document to be created in Database.
   * @returns {Promise<T>}
   */
  async create(document: T): Promise<T> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const done = await this.model.create(document)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (document.image){
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await ImageConversionUtils.toWebp(process.cwd()+"\\"+document.image.path, process.cwd()+"\\..\\uploads\\"+document.image.name, 20)
      }
      return done
    } catch (error) {
      console.log(error)
      throw new HttpException(error, 500)
    }
  }

  /**
   * Changes an existing Document in the Database
   * --------------------------------------------
   *
   * searches
   *
   * @example
   * // Document to be changed
   * const document = {
   *   _id: '', // Search is based on this field.
   *   // ... fields
   * }
   *
   * simpleService.change(document)
   *
   * @param {T} document - Document to be Changed.
   * @returns {Promise<T>}
   */
  async change(document: T): Promise<T> {
    try {
      await this.model.findByIdAndUpdate(document._id, document).exec()
      const done = (await this.fetch(document._id)) as T;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (document.image){
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await ImageConversionUtils.toWebp(process.cwd()+"\\"+done.image.path, process.cwd()+"\\..\\uploads\\"+done.image.name, 20)
      }
      return done
    } catch (error) {
      console.log(error)
      throw new HttpException(error, 400)
    }
  }

  /**
   * Removes a Document form the Database
   * ------------------------------------
   *
   * It will return `true` if the document is removed successfully
   * and vice versa.
   *
   * @example
   * // ObjectId of a Document
   * const id = '5abd...'
   *
   * if (simpleService.remove(id)) {
   *   // The Document was removed successfully.
   * } else {
   *   // The Document was removed for some reason.
   * }
   *
   * @param {string} id - ObjectId of existing Document
   * @returns {boolean}
   */
  remove(id?: string): Promise<Document> {
    try {
      return this.model.findByIdAndRemove(id).exec()
    } catch (error) {
      throw new HttpException(error, 500)
    }
  }

  /* Aliases for Create */
  readonly add = this.create
  readonly find = this.fetch
  readonly query = this.fetch
  readonly insert = this.create

  /* Aliases for Change */
  readonly edit = this.change
  readonly update = this.change

  /* Alias for Remove */
  readonly delete = this.remove
}
