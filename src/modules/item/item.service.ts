import { type Item } from '../../../database/schema';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../../helpers/api.erros';
import { type IItemRepository } from './Iitem.repository';

export class ItemService {
  constructor(private readonly itemRepository: IItemRepository) {}

  async create(itemInfo: Item): Promise<Item | undefined> {
    const shopExists = await this.itemRepository.shopExists(itemInfo.shopId);

    if (!shopExists)
      throw new NotFoundError('Shop with the specified ID not found');

    const itemExists = await this.itemRepository.exists(
      itemInfo.shopId,
      itemInfo.name,
    );

    // TODO Incluir verificação para categoria

    if (itemExists) throw new ConflictError('Item already exists');

    const newItem = await this.itemRepository.create(itemInfo);

    return newItem;
  }

  async getById(itemId: string): Promise<Item | undefined> {
    const itemFound = await this.itemRepository.getById(itemId);

    if (!itemFound) throw new NotFoundError('Item not found');

    return itemFound;
  }

  async getItems(): Promise<Item[]> {
    const items = await this.itemRepository.list();

    if (!items || items.length < 1) throw new NotFoundError('No items found');

    return items;
  }

  async update(newItemInfo: Item): Promise<Item | undefined> {
    const updatedItem = await this.itemRepository.update(newItemInfo);

    if (!updatedItem) throw new InternalServerError();

    return updatedItem;
  }
}
