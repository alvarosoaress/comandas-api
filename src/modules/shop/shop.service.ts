import {
  type ShopExtendedSafe,
  type Shop,
  type QrCode,
  type ItemCategory,
  type OrderFormatted,
  type ShopSchedule,
  type ItemMenu,
} from '../../../database/schema';
import { InternalServerError, NotFoundError } from '../../helpers/api.erros';

import { type IShopRepository } from './Ishop.repository';
import {
  type ShopUpdateType,
  type ShopCreateType,
  type ShopListType,
  type ShopListResType,
} from './shop.schema';

export class ShopService {
  constructor(private readonly shopRepository: IShopRepository) {}

  async create(info: ShopCreateType): Promise<ShopExtendedSafe> {
    const newShop = await this.shopRepository.create(info);

    if (!newShop) throw new InternalServerError();

    return newShop;
  }

  async list(query?: ShopListType): Promise<ShopListResType[]> {
    const shops = await this.shopRepository.list(query);

    if (!shops || shops.length < 1) throw new NotFoundError('No shops found');

    return shops;
  }

  async getMenu(userId: string): Promise<ItemMenu[] | undefined> {
    const shopMenu = await this.shopRepository.getMenu(userId);

    if (!shopMenu) throw new NotFoundError('No shop found');

    if (!shopMenu || shopMenu.length < 1)
      throw new NotFoundError('Shop has no menu');

    return shopMenu;
  }

  async getQrCodes(userId: string): Promise<QrCode[] | undefined> {
    const shopQrCodes = await this.shopRepository.getQrCodes(userId);

    if (!shopQrCodes) throw new NotFoundError('No shop found');

    if (!shopQrCodes || shopQrCodes.length < 1)
      throw new NotFoundError('Shop has no QrCodes');

    return shopQrCodes;
  }

  async getOrders(userId: string): Promise<OrderFormatted[] | undefined> {
    const shopOrders = await this.shopRepository.getOrders(userId);

    if (!shopOrders) throw new NotFoundError('No shop found');

    if (!shopOrders || shopOrders.length < 1)
      throw new NotFoundError('Shop has no orders');

    return shopOrders;
  }

  async getItemCategories(userId: string): Promise<ItemCategory[] | undefined> {
    const shopItemCategories =
      await this.shopRepository.getItemCategories(userId);

    if (!shopItemCategories) throw new NotFoundError('No shop found');

    if (!shopItemCategories || shopItemCategories.length < 1)
      throw new NotFoundError('Shop has no item categories');

    return shopItemCategories;
  }

  async getSchedule(userId: string): Promise<ShopSchedule[] | undefined> {
    const shopSchedule = await this.shopRepository.getSchedule(userId);

    if (!shopSchedule) throw new NotFoundError('No shop found');

    if (!shopSchedule || shopSchedule.length < 1)
      throw new NotFoundError('Shop has no schedule');

    return shopSchedule;
  }

  async update(newShopInfo: ShopUpdateType): Promise<Shop | undefined> {
    const shopExists = await this.shopRepository.exists(newShopInfo.userId);

    if (!shopExists) throw new NotFoundError('No shop found');

    const updatedShop = await this.shopRepository.update(newShopInfo);

    if (!updatedShop) throw new InternalServerError();

    return updatedShop;
  }
}
