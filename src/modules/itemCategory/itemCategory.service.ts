import { type ItemCategory } from '../../../database/schema';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../../helpers/api.erros';
import { type IItemCategoryRepository } from './IitemCategory.repository';
import {
  type ItemCategorySetType,
  type ItemCategoryCreateType,
  type ItemCategoryRemoveType,
} from './itemCategory.schema';

export class ItemCategoryService {
  constructor(
    private readonly itemCategoryRepository: IItemCategoryRepository,
  ) {}

  async getById(itemCategoryId: string): Promise<ItemCategory> {
    const itemCategoryFound =
      await this.itemCategoryRepository.getById(itemCategoryId);

    if (!itemCategoryFound) throw new NotFoundError('Item category not found');

    return itemCategoryFound;
  }

  async list(): Promise<ItemCategory[]> {
    const itemCategories = await this.itemCategoryRepository.list();

    if (!itemCategories || itemCategories.length <= 0)
      throw new NotFoundError('No item categories found');

    return itemCategories;
  }

  async create(
    itemCategoryInfo: ItemCategoryCreateType,
  ): Promise<ItemCategory> {
    const shopExists = await this.itemCategoryRepository.existsShop(
      itemCategoryInfo.shopId,
    );

    if (!shopExists) throw new NotFoundError('Shop not found');

    const itemCategoryExists = await this.itemCategoryRepository.existsByShop(
      itemCategoryInfo.shopId,
      itemCategoryInfo.name,
    );

    if (itemCategoryExists)
      throw new ConflictError('Item category already exists');

    const newItemCategory =
      await this.itemCategoryRepository.create(itemCategoryInfo);

    if (!newItemCategory) throw new InternalServerError();

    return newItemCategory;
  }

  async set(setInfo: ItemCategorySetType): Promise<ItemCategory> {
    const itemExists = await this.itemCategoryRepository.existsItem(
      setInfo.itemId,
    );

    if (!itemExists) throw new NotFoundError('Item not found');

    const itemCategoryExists = await this.itemCategoryRepository.existsById(
      setInfo.itemCategoryId,
    );

    if (!itemCategoryExists) throw new NotFoundError('Item category not found');

    const newSet = await this.itemCategoryRepository.set(setInfo);

    if (!newSet) throw new InternalServerError();

    return newSet;
  }

  async remove(
    removeInfo: ItemCategoryRemoveType,
  ): Promise<ItemCategory | undefined> {
    const itemExists = await this.itemCategoryRepository.existsItem(
      removeInfo.itemId,
    );

    if (!itemExists) throw new NotFoundError('Item not found');

    const itemCategoryExists = await this.itemCategoryRepository.existsById(
      removeInfo.itemCategoryId,
    );

    if (!itemCategoryExists) throw new NotFoundError('Item category not found');

    const newRemove = await this.itemCategoryRepository.remove(removeInfo);

    if (!newRemove) throw new InternalServerError();

    return newRemove;
  }
}
