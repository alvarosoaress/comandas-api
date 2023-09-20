import { type SQL, eq, sql } from 'drizzle-orm';
import { db } from '../../../database';
import { type IShopRepository } from './Ishop.repository';
import {
  shop,
  type Item,
  type ShopExtendedSafe,
  type Shop,
} from '../../../database/schema';
import { type AddressService } from '../address/address.service';
import { type UserService } from '../user/user.service';
import deleteObjKey from '../../utils';
import {
  type ShopUpdateType,
  type ShopCreateType,
  type ShopListType,
  type ShopListResType,
} from './shop.schema';
import { MySqlDialect } from 'drizzle-orm/mysql-core';

export class ShopRepository implements IShopRepository {
  constructor(
    private readonly addressService: AddressService,
    private readonly userService: UserService,
  ) {}

  async create(info: ShopCreateType): Promise<ShopExtendedSafe | undefined> {
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

    const newShop = await db.query.shop.findFirst({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      where: eq(shop.userId, newUser.id!),
      with: {
        addressInfo: true,
        userInfo: true,
        categories: {
          with: { categories: { columns: { name: true, id: true } } },
        },
      },
    });

    if (!newShop) return undefined;

    const newShopTreated = {
      ...newShop,
      categories: newShop?.categories.map((category) => ({
        name: category.categories.name,
        id: category.categories.id,
      })),
    };

    return newShopTreated;
  }

  async list(query?: ShopListType): Promise<ShopListResType> {
    // if (!query) {
    //   const shops = await db.query.shop.findMany({
    //     with: {
    //       addressInfo: true,
    //       userInfo: true,
    //       categories: {
    //         with: { categories: { columns: { name: true, id: true } } },
    //       },
    //     },
    //   });
    //   const shopsTreated = shops.map((shop) => ({
    //     ...shop,
    //     categories: shop.categories.map((category) => ({
    //       name: category.categories.name,
    //       id: category.categories.id,
    //     })),
    //   }));

    //   return shopsTreated;
    // }

    const shopsBase = sql`
        SELECT s.tables, s.user_id, s.createdAt, s.updatedAt, a.id as address_id, a.city, a.state, a.street, a.country, a.lat, a.long, a.neighborhood, a.number, u.email, u.phone_number, u.name, gc.name as category_name, gc.id as category_id
        FROM shops as s
        JOIN addresses as a ON s.address_id = a.id
        JOIN users as u ON s.user_id = u.id
        JOIN shop_categories as sc ON s.user_id = sc.shop_id
        JOIN general_categories as gc ON sc.general_category_id = gc.id
    `;

    const sqlChunks: SQL[] = [];

    sqlChunks.push(shopsBase);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (Object.values(query!).length && query) {
      sqlChunks.push(sql` WHERE `);

      if (query.categories) {
        if (query.categories.length === 1)
          sqlChunks.push(sql`sc.general_category_id = ${query.categories[0]}`);
        else {
          for (let index = 0; index < query.categories.length; index++) {
            sqlChunks.push(
              sql` sc.general_category_id = ${query.categories[index]} `,
            );

            if (index === query.categories.length - 1) continue;
            sqlChunks.push(sql` or `);
          }
        }
      }

      if (query.city) {
        if (sqlChunks.length > 2) sqlChunks.push(sql` AND `);
        sqlChunks.push(sql`a.city LIKE ${query.city}`);
      }
      if (query.country) {
        if (sqlChunks.length > 2) sqlChunks.push(sql` AND `);
        sqlChunks.push(sql`a.country LIKE ${query.country}`);
      }
      if (query.state) {
        if (sqlChunks.length > 2) sqlChunks.push(sql` AND `);
        sqlChunks.push(sql`a.state LIKE ${query.state}`);
      }
      if (query.maxtables) {
        if (sqlChunks.length > 2) sqlChunks.push(sql` AND `);
        sqlChunks.push(sql`s.tables <= ${parseInt(query.maxtables)}`);
      }
      if (query.mintables) {
        if (sqlChunks.length > 2) sqlChunks.push(sql` AND `);
        sqlChunks.push(sql`s.tables >= ${parseInt(query.mintables)}`);
      }
      if (query.tables) {
        if (sqlChunks.length > 2) sqlChunks.push(sql` AND `);
        sqlChunks.push(sql`s.tables = ${parseInt(query.tables)}`);
      }
      if (query.limit) {
        sqlChunks.push(sql`LIMIT ${parseInt(query.limit)}`);
      }
    }

    const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));
    // console.log(new MySqlDialect().sqlToQuery(finalSql));

    const result = await db.execute(finalSql);

    // console.log(result[0]);
    // console.log(query);

    return result[0] as unknown as ShopListResType;
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

  async exists(userId: number): Promise<boolean> {
    const shopFound = await db.query.shop.findFirst({
      where: eq(shop.userId, userId),
    });

    return !!shopFound;
  }

  async update(newShopInfo: ShopUpdateType): Promise<Shop | undefined> {
    newShopInfo.updatedAt = new Date();

    // Salvando e retirando userId de newShopInfo
    // para evitar o usuário atualizar o id do shop no BD
    const userId = newShopInfo.userId;

    deleteObjKey(newShopInfo, 'userId');

    await db.update(shop).set(newShopInfo).where(eq(shop.userId, userId));

    const updatedShop = await db.query.shop.findFirst({
      where: eq(shop.userId, userId),
    });

    return updatedShop;
  }
}
