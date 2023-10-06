import { ItemCategoryController } from './itemCategory.controller';
import { ItemCategoryRepository } from './itemCategory.repository';
import { ItemCategoryService } from './itemCategory.service';

export function ItemCategoryFactory(): ItemCategoryController {
  const itemCategoryRepository = new ItemCategoryRepository();
  const itemCategoryService = new ItemCategoryService(itemCategoryRepository);
  const itemCategoryController = new ItemCategoryController(
    itemCategoryService,
  );

  return itemCategoryController;
}
