import { eq } from 'drizzle-orm';
import { db } from '../../../database';
import { type IShopRepository } from './Ishop.repository';
import {
  type ShopExtended,
  shop,
  type Item,
  type ShopExtendedSafe,
  type Shop,
  generalCategory,
  type ShopWithCategories,
} from '../../../database/schema';
import { type AddressService } from '../address/address.service';
import { type UserService } from '../user/user.service';
import deleteObjKey from '../../utils';
import { type ShopUpdateType, type ShopCreateType } from './shop.schema';

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

  async list(): Promise<ShopExtended[]> {
    const shops = await db.query.shop.findMany({
      with: {
        addressInfo: true,
        userInfo: true,
        categories: {
          with: { categories: { columns: { name: true, id: true } } },
        },
      },
    });

    const shopsTreated = shops.map((shop) => ({
      ...shop,
      categories: shop.categories.map((category) => ({
        name: category.categories.name,
        id: category.categories.id,
      })),
    }));

    return shopsTreated;
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

  async existsGeneralCategory(generalCategoryId: number): Promise<boolean> {
    const generalCategoryExists = await db.query.generalCategory.findFirst({
      where: eq(generalCategory.id, generalCategoryId),
    });

    return !!generalCategoryExists;
  }

  async update(
    newShopInfo: ShopUpdateType,
  ): Promise<Shop | ShopWithCategories | undefined> {
    // TODO ADICIONAR OPÇÃO PARA MODIFICAR CATEGORIAS
    // PARA ISSO PRECISA CRIAR MODULE GENERAL CATEGORY
    // E DPS USAR OS METODOS DELE AQUI PARA PODER DAR INSERT
    // NA TABELA ASSOCIATIVA SHOPS_CATEGORIES
    newShopInfo.updatedAt = new Date();

    // Salvando e retirando userId de newShopInfo
    // para evitar o usuário atualizar o id do shop no BD
    const userId = newShopInfo.userId;

    deleteObjKey(newShopInfo, 'userId');

    await db.update(shop).set(newShopInfo).where(eq(shop.userId, userId));

    // Se o usuário enviar categorias para serem atualizadas
    // if (newShopInfo.categories && newShopInfo.categories.length >= 1) {
    //   // ?HACK Temporario para adicioar categorias
    //   await db.transaction(async (tx) => {
    //     newShopInfo.categories?.forEach(async (category) => {
    //       await tx.insert(shopCategory).values({
    //         shopId: userId,
    //         generalCategoryId: category.id,
    //       });
    //     });
    //   });

    //   const updatedShop = await db.query.shop.findFirst({
    //     where: eq(shop.userId, userId),
    //     with: {
    //       categories: {
    //         with: { categories: { columns: { name: true, id: true } } },
    //       },
    //     },
    //   });

    //   if (!updatedShop) return undefined;

    //   const updatedShopTreated: ShopWithCategories = {
    //     ...updatedShop,
    //     categories: updatedShop?.categories.map((category) => ({
    //       name: category.categories.name,
    //       id: category.categories.id,
    //     })),
    //   };

    //   return updatedShopTreated;
    // }

    const updatedShop = await db.query.shop.findFirst({
      where: eq(shop.userId, userId),
    });

    return updatedShop;
  }
}
