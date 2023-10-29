import { type Item } from '../../../../database/schema';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../../../helpers/api.erros';
import { type IItemRepository } from '../Iitem.repository';
import { type ItemCreateType, type ItemUpdateType } from '../item.schema';
import { ItemService } from '../item.service';

let itemService: ItemService;
let itemRepositoryMock: jest.Mocked<IItemRepository>;

beforeEach(() => {
  itemRepositoryMock = {
    exists: jest.fn(),
    shopExists: jest.fn(),
    create: jest.fn(),
    list: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    itemCategoryExists: jest.fn(),
  };

  itemService = new ItemService(itemRepositoryMock);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Item Service', () => {
  const itemInfo: ItemCreateType = {
    name: 'Bolinea de Gorfwe',
    shopId: 1,
    price: 6.99,
    categoryId: 71,
    description: 'none',
  };
  describe('Create Item', () => {
    it('should return a new item', async () => {
      itemRepositoryMock.exists.mockResolvedValue(false);
      itemRepositoryMock.shopExists.mockResolvedValue(true);
      itemRepositoryMock.itemCategoryExists.mockResolvedValue(true);
      itemRepositoryMock.create.mockResolvedValue({ ...itemInfo, id: 1 });

      const newItem = await itemService.create(itemInfo);

      expect(itemRepositoryMock.shopExists).toBeCalledWith(itemInfo.shopId);
      expect(itemRepositoryMock.exists).toBeCalledWith(
        itemInfo.shopId,
        itemInfo.name,
      );
      expect(newItem).toHaveProperty('id');
    });

    it('should throw a error if shop with specified id not exists', async () => {
      itemRepositoryMock.exists.mockResolvedValue(false);
      itemRepositoryMock.shopExists.mockResolvedValue(false);

      await expect(itemService.create(itemInfo)).rejects.toThrowError(
        NotFoundError,
      );

      expect(itemRepositoryMock.create).not.toBeCalled();
    });

    it('should throw a error if item category with specified id not exists', async () => {
      itemRepositoryMock.exists.mockResolvedValue(false);
      itemRepositoryMock.shopExists.mockResolvedValue(true);
      itemRepositoryMock.itemCategoryExists.mockResolvedValue(false);

      await expect(itemService.create(itemInfo)).rejects.toThrowError(
        NotFoundError,
      );

      expect(itemRepositoryMock.create).not.toBeCalled();
    });

    it('should throw a error if item already exists', async () => {
      itemRepositoryMock.shopExists.mockResolvedValue(true);
      itemRepositoryMock.exists.mockResolvedValue(true);
      itemRepositoryMock.itemCategoryExists.mockResolvedValue(true);

      await expect(itemService.create(itemInfo)).rejects.toThrowError(
        ConflictError,
      );

      expect(itemRepositoryMock.create).not.toBeCalled();
    });
  });

  describe('List Items', () => {
    const itemList: Item[] = [
      {
        id: 1,
        name: 'Bolinea de Gorfwe',
        shopId: 1,
        price: 6.99,
      },
      {
        id: 2,
        name: 'Bolo de murango',
        shopId: 1,
        price: 8.99,
      },
      {
        id: 3,
        name: 'Bolinea de Gorfwe',
        shopId: 1,
        price: 6.99,
      },
    ];

    it('should return a list of items', async () => {
      itemRepositoryMock.list.mockResolvedValue(itemList);

      const items = await itemService.getItems();

      expect(itemRepositoryMock.list).toBeCalled();
      expect(items).toBeInstanceOf(Array);
      expect(items).toEqual(expect.arrayContaining(itemList));
    });

    it('should throw a error if no items found', async () => {
      itemRepositoryMock.list.mockResolvedValue([]);

      await expect(itemService.getItems()).rejects.toThrowError(NotFoundError);
    });
  });

  describe('Get By Id Item', () => {
    const itemFound: Item = {
      id: 1,
      name: 'Bolinea de Gorfwe',
      shopId: 1,
      price: 6.99,
    };
    it('should return a item with the specified ID', async () => {
      itemRepositoryMock.getById.mockResolvedValue(itemFound);

      const item = await itemService.getById('1');

      expect(itemRepositoryMock.getById).toBeCalledWith('1');

      expect(item).toHaveProperty('id');
      expect(item).toEqual(itemFound);
    });

    it('should throw a error if no item found', async () => {
      itemRepositoryMock.getById.mockResolvedValue(undefined);

      await expect(itemService.getById('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(itemRepositoryMock.getById).toBeCalledWith('1');
    });
  });

  describe('Update Item', () => {
    const updatedItem: ItemUpdateType = {
      id: 1,
      name: 'Bolinea de Gorfwe',
      price: 69.99,
    };

    const updatedItemRes: Item = {
      id: 1,
      name: 'Bolinea de Gorfwe',
      shopId: 5,
      price: 69.99,
    };
    it('should return the Updated Item', async () => {
      itemRepositoryMock.update.mockResolvedValue(updatedItemRes);

      const updateRes = await itemService.update(updatedItem);

      expect(itemRepositoryMock.update).toBeCalledWith(updatedItem);

      expect(updateRes).not.toBeUndefined();

      expect(updateRes?.id).toEqual(updatedItem.id);
    });

    it('should return Internal Server Error if some error happens in the database', async () => {
      itemRepositoryMock.update.mockResolvedValue(undefined);

      await expect(itemService.update(updatedItem)).rejects.toThrowError(
        InternalServerError,
      );
    });
  });
});
