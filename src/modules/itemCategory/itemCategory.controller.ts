/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import {
  type ItemCategoryGetType,
  type ItemCategoryCreateType,
  type ItemCategorySetType,
  type ItemCategoryRemoveType,
} from './itemCategory.schema';
import { type ItemCategoryService } from './itemCategory.service';

export class ItemCategoryController {
  constructor(private readonly itemCategoryService: ItemCategoryService) {}

  async createItemCategory(
    req: Request<unknown, unknown, ItemCategoryCreateType>,
    res: Response,
  ) {
    const newItemCategory = await this.itemCategoryService.create(req.body);

    return res.status(200).json(newItemCategory);
  }

  async listItemCategory(req: Request, res: Response) {
    const itemCategories = await this.itemCategoryService.list();

    return res.status(200).json(itemCategories);
  }

  async getItemCategory(req: Request<ItemCategoryGetType>, res: Response) {
    const itemCategory = await this.itemCategoryService.getById(req.params.id);

    return res.status(200).json(itemCategory);
  }

  async setItemCategory(
    req: Request<unknown, unknown, ItemCategorySetType>,
    res: Response,
  ) {
    const settledItemCategory = await this.itemCategoryService.set(req.body);

    return res.status(200).json(settledItemCategory);
  }

  async removeItemCategory(
    req: Request<unknown, unknown, ItemCategoryRemoveType>,
    res: Response,
  ) {
    const removedItemCategory = await this.itemCategoryService.remove(req.body);

    return res.status(200).json(removedItemCategory);
  }
}
