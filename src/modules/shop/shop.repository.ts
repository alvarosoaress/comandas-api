import { eq } from 'drizzle-orm';
import { db } from '../../../database';
import { type IShopRepository } from './Ishop.repository';
import {
  type ShopExtended,
  shop,
  type Item,
  type ShopExtendedSafe,
  type Shop,
} from '../../../database/schema';
import { type AddressService } from '../address/address.service';
import { type UserService } from '../user/user.service';
import deleteObjKey from '../../utils';
import { type createShopType } from './shop.schema';

export class ShopRepository implements IShopRepository {
  constructor(
    private readonly addressService: AddressService,
    private readonly userService: UserService,
  ) {}

  async create(info: createShopType): Promise<ShopExtendedSafe | undefined> {
    // TODO Incluir verificação para categoryId e addressId
    const newAddress = await this.addressService.create(info.addressInfo);

    const newUser = await this.userService.create({
      ...info.userInfo,
      role: 'shop',
    });

    if (!newAddress || !newUser) return undefined;

    await db.insert(shop).values({
      ...info.shopInfo,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      addressId: newAddress.id!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userId: newUser.id!,
    });

    return {
      ...info.shopInfo,
      userId: newUser.id as number,
      addressInfo: newAddress,
      userInfo: newUser,
      addressId: newAddress.id as number,
    };
  }

  async list(): Promise<ShopExtended[]> {
    const shops = await db.query.shop.findMany({
      with: {
        addressInfo: true,
        userInfo: true,
      },
    });

    return shops;
  }

  async getMenu(shopId: string): Promise<Item[] | undefined> {
    const shopMenu = await db.query.shop.findFirst({
      where: eq(shop.userId, parseInt(shopId)),
      columns: {},
      with: {
        menu: true,
      },
    });

    if (!shopMenu) return undefined;

    return Object.values(shopMenu.menu);
  }

  async update(newShopInfo: Shop): Promise<Shop | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain

    // Não há motivos para sobreescrever o createdAt
    deleteObjKey(newShopInfo, 'createdAt');

    newShopInfo.updatedAt = new Date();

    await db
      .update(shop)
      .set(newShopInfo)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .where(eq(shop.userId, newShopInfo.userId!));

    const updatedShop = await db.query.shop.findFirst({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      where: eq(shop.userId, newShopInfo.userId!),
    });

    return updatedShop;
  }
}
