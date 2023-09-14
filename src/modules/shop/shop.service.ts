import {
  type ShopExtended,
  type Item,
  type ShopExtendedSafe,
  type Shop,
} from '../../../database/schema';
import { InternalServerError, NotFoundError } from '../../helpers/api.erros';
import deleteObjKey from '../../utils';
import { type IShopRepository } from './Ishop.repository';
import { type createShopType } from './shop.schema';

export class ShopService {
  constructor(private readonly shopRepository: IShopRepository) {}

  async create(info: createShopType): Promise<ShopExtendedSafe> {
    const newShop = await this.shopRepository.create(info);

    if (!newShop) throw new InternalServerError();

    return newShop;
  }

  async list(): Promise<ShopExtendedSafe[]> {
    const shops = await this.shopRepository.list();

    if (!shops || shops.length < 1) throw new NotFoundError('No shops found');

    shops.forEach((shop: ShopExtended) => {
      deleteObjKey(shop.userInfo, 'password');
      deleteObjKey(shop.userInfo, 'refreshToken');
    });

    return shops;
  }

  async getMenu(shopId: string): Promise<Item[] | undefined> {
    const shopMenu = await this.shopRepository.getMenu(shopId);

    if (!shopMenu) throw new NotFoundError('No shop found');

    if (!shopMenu || shopMenu.length < 1)
      throw new NotFoundError('Shop has no menu');

    return shopMenu;
  }

  async update(newShopInfo: Shop): Promise<Shop | undefined> {
    const updatedShop = await this.shopRepository.update(newShopInfo);

    if (!updatedShop) throw new NotFoundError('No shop found');

    return updatedShop;
  }
}
