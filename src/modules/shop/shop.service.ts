import { type ShopMenu, type ShopSafe } from '../../../database/schema';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../../helpers/api.erros';
import deleteObjKey from '../../utils';
import { type IShopRepository } from './Ishop.repository';

export class ShopService {
  constructor(private readonly shopRepository: IShopRepository) {}

  async create(userId: number, addressId: number): Promise<ShopSafe> {
    const shopExists = await this.shopRepository.exists(userId);

    if (shopExists) throw new ConflictError('Shop already exists');

    const addressExists = await this.shopRepository.existsAddress(addressId);

    if (!addressExists)
      throw new NotFoundError('Address with specified id not found');

    const newShop = await this.shopRepository.create(userId, addressId);

    if (!newShop) throw new InternalServerError();

    deleteObjKey(newShop, 'password');
    deleteObjKey(newShop, 'refreshToken');

    return newShop;
  }

  async getById(userId: string): Promise<ShopSafe | undefined> {
    const shopFound = await this.shopRepository.getById(userId);

    if (!shopFound) throw new NotFoundError('No shop found');

    deleteObjKey(shopFound, 'password');
    deleteObjKey(shopFound, 'refreshToken');

    return shopFound;
  }

  async list(): Promise<ShopSafe[]> {
    const shops = await this.shopRepository.list();

    if (!shops || shops.length < 1) throw new NotFoundError('No shops found');

    shops.forEach((shop) => {
      deleteObjKey(shop, 'password');
      deleteObjKey(shop, 'refreshToken');
    });

    return shops;
  }

  async getMenu(userId: string): Promise<ShopMenu | undefined> {
    const shopMenu = await this.shopRepository.getMenu(userId);

    if (!shopMenu) throw new NotFoundError('No shop found');

    if (!shopMenu.items || shopMenu.items?.length < 1)
      throw new NotFoundError('Shop has no menu');

    return shopMenu;
  }
}
