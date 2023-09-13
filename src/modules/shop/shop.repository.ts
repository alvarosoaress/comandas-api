import { eq } from 'drizzle-orm';
import { db } from '../../../database';
import { type IShopRepository } from './Ishop.repository';
import {
  type Shop,
  type User,
  type Address,
  shop,
  type Item,
  type ShopSafe,
} from '../../../database/schema';
import { type AddressService } from '../address/address.service';
import { type UserService } from '../user/user.service';

export class ShopRepository implements IShopRepository {
  constructor(
    private readonly addressService: AddressService,
    private readonly userService: UserService,
  ) {}

  async create(
    userInfo: User,
    addressInfo: Address,
  ): Promise<ShopSafe | undefined> {
    const newAddress = await this.addressService.create(addressInfo);

    const newUser = await this.userService.create({
      ...userInfo,
      role: 'shop',
    });

    if (!newAddress || !newUser) return undefined;

    await db
      .insert(shop)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .values({ addressId: newAddress.id!, userId: newUser.id! });

    return {
      addressInfo: newAddress,
      userInfo: newUser,
      addressId: newAddress.id as number,
    };
  }

  async list(): Promise<Shop[]> {
    const shops = await db.query.shop.findMany({
      with: {
        addressInfo: true,
        userInfo: true,
      },
      columns: { userId: false },
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
}
