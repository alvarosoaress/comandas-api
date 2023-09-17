import { GeneralCategoryController } from './generalCategory.controller';
import { GeneralCategoryRepository } from './generalCategory.repository';
import { GeneralCategoryService } from './generalCategory.service';

export function generalCategoryFactory(): GeneralCategoryController {
  const generalCategoryRepository = new GeneralCategoryRepository();
  const generalCategoryService = new GeneralCategoryService(
    generalCategoryRepository,
  );
  const generalCategoryController = new GeneralCategoryController(
    generalCategoryService,
  );
  return generalCategoryController;
}
