/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import { type createShopType, type getShopMenuType } from './shop.schema';
import { type ShopService } from './shop.service';

export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  async createShop(
    req: Request<unknown, unknown, createShopType>,
    res: Response,
  ) {
    const newShop = await this.shopService.create(
      req.body.userInfo,
      req.body.addressInfo,
    );

    return res.status(200).json({
      error: false,
      data: newShop,
    });
  }

  async getShops(req: Request, res: Response) {
    const shops = await this.shopService.list();

    return res.status(200).json({
      error: false,
      data: shops,
    });
  }

  async getShopMenu(req: Request<getShopMenuType>, res: Response) {
    const shopMenu = await this.shopService.getMenu(req.params.id);

    return res.status(200).json({
      error: false,
      data: shopMenu,
    });
  }
}
