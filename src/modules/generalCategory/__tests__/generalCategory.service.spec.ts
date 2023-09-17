import { type GeneralCategory } from '../../../../database/schema';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../../../helpers/api.erros';
import { type IGeneralCategoryRepository } from '../IgeneralCategory.repository';
import {
  type GeneralCategorySetType,
  type GeneralCategoryCreateType,
} from '../generalCategory.schema';
import { GeneralCategoryService } from '../generalCategory.service';

let generalCategoryService: GeneralCategoryService;
let generalCategoryRepositoryMock: jest.Mocked<IGeneralCategoryRepository>;

beforeEach(() => {
  generalCategoryRepositoryMock = {
    existsById: jest.fn(),
    existsByName: jest.fn(),
    create: jest.fn(),
    list: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    shopExists: jest.fn(),
    set: jest.fn(),
  };

  generalCategoryService = new GeneralCategoryService(
    generalCategoryRepositoryMock,
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('General Category Service', () => {
  describe('Create General Category', () => {
    const generalCategoryInfo: GeneralCategory = {
      name: 'kpop',
      id: 1,
    };
    it('should return a new general category', async () => {
      const newCategoryInfo: GeneralCategoryCreateType = {
        name: 'kpop',
      };

      generalCategoryRepositoryMock.existsByName.mockResolvedValue(false);
      generalCategoryRepositoryMock.create.mockResolvedValue(
        generalCategoryInfo,
      );

      const newItem = await generalCategoryService.create(newCategoryInfo);

      expect(generalCategoryRepositoryMock.existsByName).toBeCalledWith(
        newCategoryInfo.name,
      );
      expect(newItem).toHaveProperty('id');
    });

    it('should throw a error if general category already exists', async () => {
      generalCategoryRepositoryMock.existsByName.mockResolvedValue(true);

      await expect(
        generalCategoryService.create(generalCategoryInfo),
      ).rejects.toThrowError(ConflictError);

      expect(generalCategoryRepositoryMock.existsByName).toBeCalledWith(
        generalCategoryInfo.name,
      );
      expect(generalCategoryRepositoryMock.create).not.toBeCalled();
    });
  });

  describe('List General Categories', () => {
    const generalCategories: GeneralCategory[] = [
      {
        id: 1,
        name: 'kpop',
      },
      {
        id: 2,
        name: 'RomCom',
      },
      {
        id: 3,
        name: 'jpop',
      },
    ];

    it('should return a list of items', async () => {
      generalCategoryRepositoryMock.list.mockResolvedValue(generalCategories);

      const generalCategoriesList =
        await generalCategoryService.getGeneralCategories();

      expect(generalCategoryRepositoryMock.list).toBeCalled();
      expect(generalCategoriesList).toBeInstanceOf(Array);
      expect(generalCategoriesList).toEqual(
        expect.arrayContaining(generalCategories),
      );
    });

    it('should throw a error if no items found', async () => {
      generalCategoryRepositoryMock.list.mockResolvedValue([]);

      await expect(
        generalCategoryService.getGeneralCategories(),
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe('Get By Id General Category', () => {
    const categoryFound: GeneralCategory = {
      id: 1,
      name: 'kpop',
    };
    it('should return a general category with the specified ID', async () => {
      generalCategoryRepositoryMock.getById.mockResolvedValue(categoryFound);

      const generalCategory = await generalCategoryService.getById('1');

      expect(generalCategoryRepositoryMock.getById).toBeCalledWith('1');

      expect(generalCategory).toHaveProperty('id');
      expect(generalCategory).toEqual(categoryFound);
    });

    it('should throw a error if no item found', async () => {
      generalCategoryRepositoryMock.getById.mockResolvedValue(undefined);

      await expect(generalCategoryService.getById('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(generalCategoryRepositoryMock.getById).toBeCalledWith('1');
    });
  });

  describe('Update General Category', () => {
    const updatedGeneralCategory: GeneralCategory = {
      id: 1,
      name: 'jpop',
    };
    it('should return the updated general category', async () => {
      generalCategoryRepositoryMock.update.mockResolvedValue(
        updatedGeneralCategory,
      );

      const updateRes = await generalCategoryService.update(
        updatedGeneralCategory,
      );

      expect(generalCategoryRepositoryMock.update).toBeCalledWith(
        updatedGeneralCategory,
      );

      expect(updateRes).not.toBeUndefined();

      expect(updateRes?.id).toEqual(updatedGeneralCategory.id);
    });

    it('should return Internal Server Error if some error happens in the database', async () => {
      generalCategoryRepositoryMock.update.mockResolvedValue(undefined);

      await expect(
        generalCategoryService.update(updatedGeneralCategory),
      ).rejects.toThrowError(InternalServerError);
    });
  });

  describe('Delete General Category', () => {
    const deletedCategory: GeneralCategory = {
      id: 1,
      name: 'kpop',
    };
    it('should return the deleted general category', async () => {
      generalCategoryRepositoryMock.existsById.mockResolvedValue(true);
      generalCategoryRepositoryMock.delete.mockResolvedValue(deletedCategory);

      const deleteResult = await generalCategoryService.delete('1');

      expect(generalCategoryRepositoryMock.existsById).toBeCalledWith(1);
      expect(deleteResult).toEqual(deletedCategory);
    });

    it('should throw a error if no general category found with the specified id', async () => {
      generalCategoryRepositoryMock.existsById.mockResolvedValue(false);

      await expect(generalCategoryService.delete('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(generalCategoryRepositoryMock.existsById).toBeCalledWith(1);

      expect(generalCategoryRepositoryMock.delete).not.toBeCalled();
    });
  });

  describe('Set General Category', () => {
    const generalCategories: GeneralCategorySetType = {
      shopId: 1,
      generalCategoryId: [1, 2, 3],
    };

    const generalCategoriesSet = [
      { id: 1, name: 'kpop' },
      { id: 2, name: 'RomCom' },
      { id: 3, name: 'jpop' },
    ];
    it('should return all the general categories settled', async () => {
      generalCategoryRepositoryMock.shopExists.mockResolvedValue(true);
      generalCategoryRepositoryMock.existsById.mockResolvedValue(true);
      generalCategoryRepositoryMock.set.mockResolvedValue(generalCategoriesSet);

      const generalCategoriesSettled =
        await generalCategoryService.set(generalCategories);

      expect(generalCategoryRepositoryMock.shopExists).toBeCalledWith(1);
      expect(generalCategoryRepositoryMock.existsById).toBeCalled();
      expect(generalCategoryRepositoryMock.set).toBeCalled();

      expect(generalCategoriesSettled).toEqual(
        expect.arrayContaining(generalCategoriesSet),
      );
    });

    it('should throw a error if no shop found with the specified id', async () => {
      generalCategoryRepositoryMock.shopExists.mockResolvedValue(false);

      await expect(
        generalCategoryService.set(generalCategories),
      ).rejects.toThrowError(NotFoundError);

      expect(generalCategoryRepositoryMock.shopExists).toBeCalledWith(1);
      expect(generalCategoryRepositoryMock.existsById).not.toBeCalled();
      expect(generalCategoryRepositoryMock.set).not.toBeCalled();
    });

    it('should throw a error if no general category found with the specified id', async () => {
      generalCategoryRepositoryMock.shopExists.mockResolvedValue(true);
      generalCategoryRepositoryMock.existsById.mockResolvedValue(false);

      await expect(
        generalCategoryService.set(generalCategories),
      ).rejects.toThrowError(NotFoundError);

      expect(generalCategoryRepositoryMock.shopExists).toBeCalledWith(1);
      expect(generalCategoryRepositoryMock.existsById).toBeCalled();
      expect(generalCategoryRepositoryMock.set).not.toBeCalled();
    });
  });
});
