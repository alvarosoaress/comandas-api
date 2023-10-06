import { type ItemCategory } from '../../../../database/schema';
import { ConflictError, NotFoundError } from '../../../helpers/api.erros';

import { type IItemCategoryRepository } from '../IitemCategory.repository';
import {
  type ItemCategoryRemoveType,
  type ItemCategorySetType,
} from '../itemCategory.schema';
import { ItemCategoryService } from '../itemCategory.service';

let itemCategoryService: ItemCategoryService;
let itemCategoryRepositoryMock: jest.Mocked<IItemCategoryRepository>;

beforeEach(() => {
  itemCategoryRepositoryMock = {
    belongsToShop: jest.fn(),
    create: jest.fn(),
    existsById: jest.fn(),
    existsByShop: jest.fn(),
    existsItem: jest.fn(),
    existsShop: jest.fn(),
    getById: jest.fn(),
    getByShop: jest.fn(),
    list: jest.fn(),
    remove: jest.fn(),
    set: jest.fn(),
  };

  itemCategoryService = new ItemCategoryService(itemCategoryRepositoryMock);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Item Catgory Service', () => {
  describe('Create item category', () => {
    const itemCategoryInfo: ItemCategory = {
      name: 'Romcom',
      shopId: 1,
    };
    const itemCategory: ItemCategory = {
      name: 'Romcom',
      shopId: 1,
      id: 1,
    };
    it('should return a new item category', async () => {
      itemCategoryRepositoryMock.existsShop.mockResolvedValue(true);
      itemCategoryRepositoryMock.existsByShop.mockResolvedValue(false);
      itemCategoryRepositoryMock.create.mockResolvedValue(itemCategory);

      const newItemCategory =
        await itemCategoryService.create(itemCategoryInfo);

      expect(itemCategoryRepositoryMock.existsShop).toBeCalledWith(
        itemCategoryInfo.shopId,
      );
      expect(itemCategoryRepositoryMock.existsByShop).toBeCalledWith(
        itemCategoryInfo.shopId,
        itemCategoryInfo.name,
      );

      expect(newItemCategory).toHaveProperty('id');
    });

    it('should throw a error if no shop found with specified id', async () => {
      itemCategoryRepositoryMock.existsShop.mockResolvedValue(false);

      await expect(
        itemCategoryService.create(itemCategoryInfo),
      ).rejects.toThrowError(NotFoundError);

      expect(itemCategoryRepositoryMock.create).not.toBeCalled();
    });

    it('should throw a error if item category already exists', async () => {
      itemCategoryRepositoryMock.existsShop.mockResolvedValue(true);
      itemCategoryRepositoryMock.existsByShop.mockResolvedValue(true);

      await expect(
        itemCategoryService.create(itemCategoryInfo),
      ).rejects.toThrowError(ConflictError);

      expect(itemCategoryRepositoryMock.create).not.toBeCalled();
    });
  });

  describe('Get item category', () => {
    const itemCategory: ItemCategory = {
      name: 'Romcom',
      shopId: 1,
      id: 1,
    };
    it('should return a item category with the specified id', async () => {
      itemCategoryRepositoryMock.getById.mockResolvedValue(itemCategory);

      const itemCategoryFound = await itemCategoryService.getById('1');

      expect(itemCategoryRepositoryMock.getById).toBeCalledWith('1');

      expect(itemCategoryFound.id).toEqual(1);
    });

    it('should throw a error if no itemc category found with the specified id', async () => {
      itemCategoryRepositoryMock.getById.mockResolvedValue(undefined);

      await expect(itemCategoryService.getById('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(itemCategoryRepositoryMock.getById).toBeCalledWith('1');
    });
  });

  describe('List item category', () => {
    const itemCategories: ItemCategory[] = [
      {
        name: 'Romcom',
        shopId: 1,
        id: 1,
      },
      {
        name: 'Isekai',
        shopId: 1,
        id: 2,
      },
    ];
    it('should return all item categories', async () => {
      itemCategoryRepositoryMock.list.mockResolvedValue(itemCategories);

      const listItemCategory = await itemCategoryService.list();

      expect(listItemCategory).toBeInstanceOf(Array);

      expect(listItemCategory.length).toBeGreaterThanOrEqual(1);

      expect(listItemCategory).toMatchObject(itemCategories);
    });

    it('should throw a error if no item categories found', async () => {
      itemCategoryRepositoryMock.list.mockResolvedValue([]);

      await expect(itemCategoryService.list()).rejects.toThrowError(
        NotFoundError,
      );
    });
  });

  describe('Set item category', () => {
    const itemCategory: ItemCategory = {
      name: 'Romcom',
      shopId: 3,
      id: 2,
    };

    const itemSetInfo: ItemCategorySetType = {
      itemCategoryId: 2,
      itemId: 1,
    };
    it('should return the item category settled', async () => {
      itemCategoryRepositoryMock.existsItem.mockResolvedValue(true);
      itemCategoryRepositoryMock.existsById.mockResolvedValue(true);
      itemCategoryRepositoryMock.set.mockResolvedValue(itemCategory);

      const ItemCategorySettled = await itemCategoryService.set(itemSetInfo);

      expect(itemCategoryRepositoryMock.existsItem).toBeCalledWith(1);

      expect(itemCategoryRepositoryMock.existsById).toBeCalledWith(2);

      expect(itemCategoryRepositoryMock.set).toBeCalledWith(itemSetInfo);

      expect(ItemCategorySettled).toHaveProperty('id');
    });

    it('should throw a error if no item found with specified id', async () => {
      itemCategoryRepositoryMock.existsItem.mockResolvedValue(false);

      await expect(itemCategoryService.set(itemSetInfo)).rejects.toThrowError(
        NotFoundError,
      );

      expect(itemCategoryRepositoryMock.set).not.toBeCalled();
    });

    it('should throw a error if no item category found with specified id', async () => {
      itemCategoryRepositoryMock.existsItem.mockResolvedValue(true);
      itemCategoryRepositoryMock.existsById.mockResolvedValue(false);

      await expect(itemCategoryService.set(itemSetInfo)).rejects.toThrowError(
        NotFoundError,
      );

      expect(itemCategoryRepositoryMock.set).not.toBeCalled();
    });
  });

  describe('Remove item category', () => {
    const itemCategory: ItemCategory = {
      name: 'Romcom',
      shopId: 3,
      id: 2,
    };

    const itemRemoveInfo: ItemCategoryRemoveType = {
      itemCategoryId: 2,
      itemId: 1,
    };
    it('should return the removed item category', async () => {
      itemCategoryRepositoryMock.existsItem.mockResolvedValue(true);
      itemCategoryRepositoryMock.existsById.mockResolvedValue(true);
      itemCategoryRepositoryMock.remove.mockResolvedValue(itemCategory);

      const ItemCategoryRemoved =
        await itemCategoryService.remove(itemRemoveInfo);

      expect(itemCategoryRepositoryMock.existsItem).toBeCalledWith(1);

      expect(itemCategoryRepositoryMock.existsById).toBeCalledWith(2);

      expect(itemCategoryRepositoryMock.remove).toBeCalledWith(itemRemoveInfo);

      expect(ItemCategoryRemoved).toHaveProperty('id');
    });

    it('should throw a error if no item found with specified id', async () => {
      itemCategoryRepositoryMock.existsItem.mockResolvedValue(false);

      await expect(
        itemCategoryService.remove(itemRemoveInfo),
      ).rejects.toThrowError(NotFoundError);

      expect(itemCategoryRepositoryMock.remove).not.toBeCalled();
    });

    it('should throw a error if no item category found with specified id', async () => {
      itemCategoryRepositoryMock.existsItem.mockResolvedValue(true);
      itemCategoryRepositoryMock.existsById.mockResolvedValue(false);

      await expect(
        itemCategoryService.remove(itemRemoveInfo),
      ).rejects.toThrowError(NotFoundError);

      expect(itemCategoryRepositoryMock.remove).not.toBeCalled();
    });
  });
});
