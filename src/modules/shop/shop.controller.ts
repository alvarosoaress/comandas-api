/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import {
  type ShopUpdateType,
  type ShopCreateType,
  type ShopGetMenuType,
  type ShopListType,
  type ShopGetQrCodeType,
  type ShopGetItemCategoryType,
  type ShopGetOrderType,
} from './shop.schema';
import { type ShopService } from './shop.service';
import verifyOwnership from '../../middleware/verifyOwnership';
import { genericOwnership } from '../../middleware/ownership';

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

    return res.status(200).json(newShop);
  }

  async getShops(
    req: Request<unknown, unknown, unknown, ShopListType>,
    res: Response,
  ) {
    const shops = await this.shopService.list(req.query);

    return res.status(200).json(shops);
  }

  async getShopMenu(req: Request<ShopGetMenuType>, res: Response) {
    const shopMenu = await this.shopService.getMenu(req.params.id);

    return res.status(200).json(shopMenu);
  }

  async getShopQrCodes(req: Request<ShopGetQrCodeType>, res: Response) {
    const shopQrCodes = await this.shopService.getQrCodes(req.params.id);

    return res.status(200).json(shopQrCodes);
  }

  async getShopOrders(req: Request<ShopGetOrderType>, res: Response) {
    const shopOrders = await this.shopService.getOrders(req.params.id);

    return res.status(200).json(shopOrders);
  }

  async getShopItemCategories(
    req: Request<ShopGetItemCategoryType>,
    res: Response,
  ) {
    const shopItemCategories = await this.shopService.getItemCategories(
      req.params.id,
    );

    return res.status(200).json(shopItemCategories);
  }

  async updateShop(
    req: Request<unknown, unknown, ShopUpdateType>,
    res: Response,
  ) {
    verifyOwnership(
      genericOwnership(Number(req.user.id), req.body.userId),
      req,
    );

    const updatedShop = await this.shopService.update(req.body);

    return res.status(200).json(updatedShop);
  }
}
