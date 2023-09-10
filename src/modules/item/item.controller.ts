/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import {
  type updateItemType,
  type createItemType,
  type getItemType,
} from './item.schema';
import { type ItemService } from './item.service';

export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  async createItem(
    req: Request<unknown, unknown, createItemType>,
    res: Response,
  ) {
    const newItem = await this.itemService.create(req.body);

    return res.status(200).json({
      error: false,
      data: newItem,
    });
  }

  async getItems(req: Request, res: Response) {
    const items = await this.itemService.getItems();

    return res.status(200).json({
      error: false,
      data: items,
    });
  }

  async getItemById(req: Request<getItemType>, res: Response) {
    const itemFound = await this.itemService.getById(req.params.id);

    return res.status(200).json({
      error: false,
      data: itemFound,
    });
  }

  async updateItem(
    req: Request<unknown, unknown, updateItemType>,
    res: Response,
  ) {
    const updatedItem = await this.itemService.update(req.body);

    return res.status(200).json({
      error: false,
      data: updatedItem,
    });
  }
}
