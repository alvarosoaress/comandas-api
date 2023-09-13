import {
  type Address,
  type Shop,
  type User,
  type Item,
  type ShopSafe,
} from '../../../database/schema';
import { InternalServerError, NotFoundError } from '../../helpers/api.erros';
import deleteObjKey from '../../utils';
import { type IShopRepository } from './Ishop.repository';

export class ShopService {
  constructor(private readonly shopRepository: IShopRepository) {}

  async create(userInfo: User, addressInfo: Address): Promise<ShopSafe> {
    const newShop = await this.shopRepository.create(userInfo, addressInfo);

    if (!newShop) throw new InternalServerError();

    return newShop;
  }

  async list(): Promise<Shop[]> {
    const shops = await this.shopRepository.list();

    if (!shops || shops.length < 1) throw new NotFoundError('No shops found');

    shops.forEach((shop) => {
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
}
