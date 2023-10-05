import {
  type ShopExtended,
  type Item,
  type ShopExtendedSafe,
  type Shop,
  type QrCode,
} from '../../../database/schema';
import { InternalServerError, NotFoundError } from '../../helpers/api.erros';
import deleteObjKey from '../../utils';
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

    // shops.forEach((shop: ShopExtended) => {
    //   deleteObjKey(shop.userInfo, 'password');
    //   deleteObjKey(shop.userInfo, 'refreshToken');
    // });

    return shops;
  }

  async getMenu(shopId: string): Promise<Item[] | undefined> {
    const shopMenu = await this.shopRepository.getMenu(shopId);

    if (!shopMenu) throw new NotFoundError('No shop found');

    if (!shopMenu || shopMenu.length < 1)
      throw new NotFoundError('Shop has no menu');

    return shopMenu;
  }

  async getQrCodes(shopId: string): Promise<QrCode[] | undefined> {
    const shopQrCodes = await this.shopRepository.getQrCodes(shopId);

    if (!shopQrCodes) throw new NotFoundError('No shop found');

    if (!shopQrCodes || shopQrCodes.length < 1)
      throw new NotFoundError('Shop has no QrCodes');

    return shopQrCodes;
  }

  async update(newShopInfo: ShopUpdateType): Promise<Shop | undefined> {
    const shopExists = await this.shopRepository.exists(newShopInfo.userId);

    if (!shopExists) throw new NotFoundError('No shop found');

    const updatedShop = await this.shopRepository.update(newShopInfo);

    if (!updatedShop) throw new InternalServerError();

    return updatedShop;
  }
}
