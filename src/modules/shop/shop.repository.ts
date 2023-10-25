import { type SQL, eq, sql } from 'drizzle-orm';
import { db } from '../../../database';
import { type IShopRepository } from './Ishop.repository';
import {
  shop,
  type Item,
  type ShopExtendedSafe,
  type Shop,
  type QrCode,
  type ItemCategory,
  type Order,
  type OrderFormatted,
  type ShopSchedule,
} from '../../../database/schema';
import { type AddressService } from '../address/address.service';
import { type UserService } from '../user/user.service';
import { deleteObjKey, formatOrder } from '../../utils';
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

    await this.userService.exists(info.userInfo.email);

    await this.addressService.exists(info.addressInfo);

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
        schedule: true,
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

  async list(query?: ShopListType): Promise<ShopListResType[]> {
    const shopsBase = sql`
        SELECT s.tables, s.user_id, s.createdAt, s.updatedAt, s.photo_url, a.id as address_id, a.city, a.state, a.street, a.country, a.lat, a.long, a.neighborhood, a.number, u.email, u.phone_number, u.name, gc.name as category_name, gc.id as category_id
        FROM shop as s
        JOIN address as a ON s.address_id = a.id
        JOIN user as u ON s.user_id = u.id
        JOIN shop_category as sc ON s.user_id = sc.shop_id
        JOIN general_category as gc ON sc.general_category_id = gc.id
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
      if (query.search) {
        if (sqlChunks.length > 2) sqlChunks.push(sql` AND `);
        sqlChunks.push(sql`
        CONCAT(u.name, ' ', gc.name, ' ', a.street, ' ', a.city, ' ', a.neighborhood)
        LIKE CONCAT('%', ${query.search}, '%')
        ORDER BY
            CASE
                WHEN u.name LIKE ${query.search} THEN 1
                WHEN gc.name LIKE ${query.search} THEN 2
                WHEN a.street LIKE ${query.search} THEN 3
                WHEN a.city LIKE ${query.search} THEN 4
                WHEN a.neighborhood LIKE ${query.search} THEN 5
                ELSE 6
            END
            `);
      }
      console.log(query.search);
      if (query.limit) {
        if (sqlChunks.length <= 2) sqlChunks.pop();
        sqlChunks.push(sql`LIMIT ${parseInt(query.limit)}`);
      }
    }

    const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));
    console.log(new MySqlDialect().sqlToQuery(finalSql));

    const result = await db.execute(finalSql);

    const resultTyped = result[0] as unknown as ShopListResType[];

    // -----------------------

    const shopScheduleSql = sql`
    SELECT * FROM menuappTest.shop_schedule as sch
    WHERE`;

    const sqlChunksSchedule: SQL[] = [];

    sqlChunksSchedule.push(shopScheduleSql);

    for (let index = 0; index < resultTyped.length; index++) {
      sqlChunksSchedule.push(sql`sch.shop_id = ${resultTyped[index].user_id}`);

      if (index !== resultTyped.length - 1) sqlChunksSchedule.push(sql`OR`);
    }

    const finalScheduleSql: SQL = sql.join(sqlChunksSchedule, sql.raw(' '));

    const resultSchedule = await db.execute(finalScheduleSql);

    const resultScheduleTyped = resultSchedule[0] as unknown as ShopSchedule[];

    resultTyped.forEach((shop) => {
      shop.schedule = resultScheduleTyped.filter(
        (schedule) => schedule.shop_id === shop.user_id,
      );
    });

    // -----------------------

    // console.log(result[0]);
    // console.log(query);

    return resultTyped;
  }

  async getMenu(userId: string): Promise<Item[] | undefined> {
    const shopMenu = await db.query.shop.findFirst({
      where: eq(shop.userId, parseInt(userId)),
      columns: {},
      with: {
        menu: true,
      },
    });

    if (!shopMenu) return undefined;

    return Object.values(shopMenu.menu);
  }

  async getQrCodes(userId: string): Promise<QrCode[] | undefined> {
    const shopQrCodes = await db.query.shop.findFirst({
      where: eq(shop.userId, parseInt(userId)),
      columns: {},
      with: {
        qrCodes: true,
      },
    });

    if (!shopQrCodes) return undefined;

    return Object.values(shopQrCodes.qrCodes);
  }

  async getItemCategories(userId: string): Promise<ItemCategory[] | undefined> {
    const shopItemCategories = await db.query.shop.findFirst({
      where: eq(shop.userId, parseInt(userId)),
      columns: {},
      with: {
        itemCategories: true,
      },
    });

    if (!shopItemCategories) return undefined;

    return Object.values(shopItemCategories.itemCategories);
  }

  async getOrders(userId: string): Promise<OrderFormatted[] | undefined> {
    const shopOrders = await db.query.shop.findFirst({
      where: eq(shop.userId, parseInt(userId)),
      columns: {},
      with: {
        orders: true,
      },
    });

    if (!shopOrders) return undefined;

    const orderArray = new Map<string, Order[] | undefined>();

    Object.values(shopOrders.orders).forEach((order) => {
      const groupIdIndex = String(order.groupId);

      let index = orderArray.get(groupIdIndex);

      if (!index) {
        orderArray.set(groupIdIndex, []);
        index = orderArray.get(groupIdIndex);
      }

      index?.push(order);
      orderArray.set(groupIdIndex, index);
    });

    const formattedOrderArray: OrderFormatted[] | undefined = [];

    orderArray.forEach((arrayOrder) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formattedOrderArray.push(formatOrder(arrayOrder!)),
    );

    return formattedOrderArray;
  }

  async getSchedule(userId: string): Promise<ShopSchedule[] | undefined> {
    const shopSchedule = await db.query.shop.findFirst({
      where: eq(shop.userId, parseInt(userId)),
      columns: {},
      with: {
        schedule: true,
      },
    });

    if (!shopSchedule) return undefined;

    return Object.values(shopSchedule.schedule);
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
