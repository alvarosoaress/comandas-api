/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import {
  type ShopUpdateType,
  type ShopCreateType,
  type ShopGetMenuType,
  type ShopListType,
} from './shop.schema';
import { type ShopService } from './shop.service';

export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  async createShop(
    req: Request<unknown, unknown, ShopCreateType>,
    res: Response,
  ) {
    const info: ShopCreateType = {
      shopInfo: req.body.shopInfo,
      userInfo: req.body.userInfo,
      addressInfo: req.body.addressInfo,
    };
    const newShop = await this.shopService.create(info);

    return res.status(200).json({
      error: false,
      data: newShop,
    });
  }

  async getShops(
    req: Request<unknown, unknown, unknown, ShopListType>,
    res: Response,
  ) {
    const shops = await this.shopService.list(req.query);

    return res.status(200).json({
      error: false,
      data: shops,
    });
  }

  async getShopMenu(req: Request<ShopGetMenuType>, res: Response) {
    const shopMenu = await this.shopService.getMenu(req.params.id);

    return res.status(200).json({
      error: false,
      data: shopMenu,
    });
  }

  async updateShop(
    req: Request<unknown, unknown, ShopUpdateType>,
    res: Response,
  ) {
    const updatedShop = await this.shopService.update(req.body);

    return res.status(200).json({
      error: false,
      data: updatedShop,
    });
  }
}
