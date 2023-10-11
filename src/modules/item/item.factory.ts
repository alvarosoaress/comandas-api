import { ItemController } from './item.controller';
import { ItemRepository } from './item.repository';
import { ItemService } from './item.service';

export function itemFactory(): ItemController {
  const itemRepository = new ItemRepository();
  const itemService = new ItemService(itemRepository);
  const itemController = new ItemController(itemService);
  return itemController;
}
