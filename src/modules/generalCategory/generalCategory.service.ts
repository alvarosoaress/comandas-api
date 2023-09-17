import { type GeneralCategory } from '../../../database/schema';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../../helpers/api.erros';
import { type IGeneralCategoryRepository } from './IgeneralCategory.repository';
import {
  type GeneralCategoryUpdateType,
  type GeneralCategoryCreateType,
  type GeneralCategorySetType,
} from './generalCategory.schema';

export class GeneralCategoryService {
  constructor(
    private readonly generalCategoryRepository: IGeneralCategoryRepository,
  ) {}

  async create(
    categoryInfo: GeneralCategoryCreateType,
  ): Promise<GeneralCategory | undefined> {
    const categoryExists = await this.generalCategoryRepository.existsByName(
      categoryInfo.name,
    );

    if (categoryExists)
      throw new ConflictError('General Category already exists');

    const newGeneralCategory =
      await this.generalCategoryRepository.create(categoryInfo);

    return newGeneralCategory;
  }

  async getById(categoryId: string): Promise<GeneralCategory | undefined> {
    const categoryFound =
      await this.generalCategoryRepository.getById(categoryId);

    if (!categoryFound) throw new NotFoundError('GeneralCategory not found');

    return categoryFound;
  }

  async getGeneralCategories(): Promise<GeneralCategory[]> {
    const categories = await this.generalCategoryRepository.list();

    if (!categories || categories.length < 1)
      throw new NotFoundError('No general categories found');

    return categories;
  }

  async update(
    newItemInfo: GeneralCategoryUpdateType,
  ): Promise<GeneralCategory | undefined> {
    const updatedCategory =
      await this.generalCategoryRepository.update(newItemInfo);

    if (!updatedCategory) throw new InternalServerError();

    return updatedCategory;
  }

  async delete(categoryId: string): Promise<GeneralCategory | undefined> {
    const categoryExists = await this.generalCategoryRepository.existsById(
      parseInt(categoryId),
    );

    if (!categoryExists) throw new NotFoundError('No general category found');

    const categoryDeleted =
      await this.generalCategoryRepository.delete(categoryId);

    if (!categoryDeleted) throw new InternalServerError();

    return categoryDeleted;
  }

  async set(
    categorySetInfo: GeneralCategorySetType,
  ): Promise<Array<{ name: string; id: number } | undefined> | undefined> {
    const shopExists = await this.generalCategoryRepository.shopExists(
      categorySetInfo.shopId,
    );

    if (!shopExists) throw new NotFoundError('No shop found');

    // For Of é necessário pois o forEach não lida bem com async await
    // o throw erro não iria dar break no forEach
    for (const category of categorySetInfo.generalCategoryId) {
      const categoryFound =
        await this.generalCategoryRepository.existsById(category);
      if (!categoryFound)
        throw new NotFoundError(`Category id ${category} not found`);
    }

    const settledCategories =
      await this.generalCategoryRepository.set(categorySetInfo);

    return settledCategories;
  }
}
