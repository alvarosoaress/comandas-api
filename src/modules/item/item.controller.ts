/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import {
  type ItemUpdateType,
  type ItemCreateType,
  type ItemGetType,
} from './item.schema';
import { type ItemService } from './item.service';
import verifyOwnership from '../../middleware/verifyOwnership';
import {
  genericOwnership,
  itemCategoryOwnership,
  itemOwnership,
} from '../../middleware/ownership';

export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  async createItem(
    req: Request<unknown, unknown, ItemCreateType>,
    res: Response,
  ) {
    verifyOwnership(
      genericOwnership(Number(req.user.id), req.body.shopId),
      req,
    );

    if (req.body.categoryId) {
      verifyOwnership(
        await itemCategoryOwnership(Number(req.user.id), req.body.categoryId),
        req,
      );
    }

    const newItem = await this.itemService.create(req.body);

    return res.status(200).json(newItem);
  }

  async getItems(req: Request, res: Response) {
    const items = await this.itemService.getItems();

    return res.status(200).json(items);
  }

  async getItemById(req: Request<ItemGetType>, res: Response) {
    const itemFound = await this.itemService.getById(req.params.id);

    return res.status(200).json(itemFound);
  }

  async updateItem(
    req: Request<unknown, unknown, ItemUpdateType>,
    res: Response,
  ) {
    verifyOwnership(await itemOwnership(Number(req.user.id), req.body.id), req);

    const updatedItem = await this.itemService.update(req.body);

    return res.status(200).json(updatedItem);
  }
}
