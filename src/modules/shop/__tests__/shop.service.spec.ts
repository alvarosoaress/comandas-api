import {
  type Shop,
  type Item,
  type ShopExtended,
  type QrCode,
  type ItemCategory,
  type Order,
} from '../../../../database/schema';
import { NotFoundError } from '../../../helpers/api.erros';
import { type IShopRepository } from '../Ishop.repository';
import {
  type ShopUpdateType,
  type ShopCreateType,
  type ShopListResType,
} from '../shop.schema';
import { ShopService } from '../shop.service';

describe('Shop Service', () => {
  let shopService: ShopService;
  let shopRepositoryMock: jest.Mocked<IShopRepository>;

  beforeEach(() => {
    shopRepositoryMock = {
      create: jest.fn(),
      list: jest.fn(),
      getMenu: jest.fn(),
      exists: jest.fn(),
      update: jest.fn(),
      getQrCodes: jest.fn(),
      getItemCategories: jest.fn(),
      getOrders: jest.fn(),
    };

    shopService = new ShopService(shopRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Shop', () => {
    const shopInfo: ShopExtended = {
      tables: 5,
      userId: 1,
      addressId: 1,
      userInfo: {
        email: 'maquinabeloz@tute.italia',
        id: 1,
        name: 'Francesco Virgulini',
        password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
        role: 'shop' as const,
        refreshToken: 'nothingsafeandencryptedrefreshtokenold',
      },
      addressInfo: {
        city: 'City Test',
        neighborhood: 'Francesco',
        number: 69,
        street: 'Virgulini',
        state: 'Tute',
        country: 'Italia',
      },
    };

    const newShopInfo: ShopCreateType = {
      shopInfo: {
        tables: 5,
      },
      userInfo: {
        name: 'Francesco Virgulini',
        email: 'maquinabeloz@tute.italia',
        password: 'supersafepasswordnobodywillnowhihi123',
      },
      addressInfo: {
        number: 69,
        street: 'Virgulini',
        neighborhood: 'Francesco',
        city: 'City Test',
        state: 'Tute',
        country: 'Italia',
      },
    };

    it('should create a shop', async () => {
      shopRepositoryMock.create.mockResolvedValue(shopInfo);

      const newShop = await shopService.create(newShopInfo);

      expect(shopRepositoryMock.create).toBeCalledWith(newShopInfo);

      expect(newShop).not.toHaveProperty('password');
      expect(newShop).not.toHaveProperty('refreshToken');
    });
  });

  describe('List Shop', () => {
    it('should return a list of shops', async () => {
      const shopList: ShopListResType[] = [
        {
          tables: 5,
          user_id: 1,
          createdAt: '2023-09-19 10:55:22',
          updatedAt: '2023-09-19 10:55:22',
          address_id: 1,
          city: 'Ciudade',
          state: 'Italia',
          street: 'Pizza',
          country: 'Holanda',
          lat: '13,78.4',
          long: '12,75.8',
          neighborhood: 'Bolinea',
          number: 75,
          email: 'maquinabeloz@tute.italia',
          phone_number: 15488,
          name: 'Virgulini',
          category_name: 'Fiaaaun',
          category_id: 7,
        },
      ];
      shopRepositoryMock.list.mockResolvedValue(shopList);

      const shops = await shopService.list();

      expect(shopRepositoryMock.list).toHaveBeenCalled();

      expect(shops.length).toBeGreaterThanOrEqual(1);

      expect(shops).toBeInstanceOf(Array);
      expect(shops).toEqual(expect.arrayContaining(shopList));
    });

    it('should throw a error if no shops found', async () => {
      shopRepositoryMock.list.mockResolvedValue([]);

      await expect(shopService.list()).rejects.toThrowError(NotFoundError);

      expect(shopRepositoryMock.list).toHaveBeenCalled();
    });
  });

  describe('Shop Menu', () => {
    it('should return shop id, name and menu', async () => {
      const shopMenu: Item[] = [
        {
          id: 1,
          name: 'Bolinea de Gorfe',
          shopId: 1,
          price: 9.89,
        },
        {
          id: 2,
          name: 'Acugas',
          shopId: 1,
          price: 1.89,
          description: 'Sparkling water',
          temperature: 'cold' as const,
        },
      ];

      shopRepositoryMock.getMenu.mockResolvedValue(shopMenu);

      const shopMenuFound = await shopService.getMenu('1');

      expect(shopRepositoryMock.getMenu).toHaveBeenCalledWith('1');

      expect(shopMenuFound).toEqual(shopMenu);
    });

    it('should throw a error if no shop found', async () => {
      shopRepositoryMock.getMenu.mockResolvedValue(undefined);

      await expect(shopService.getMenu('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(shopRepositoryMock.getMenu).toHaveBeenCalledWith('1');
    });

    it('should throw a error if the shop has no menu', async () => {
      const shopMenu = undefined;

      shopRepositoryMock.getMenu.mockResolvedValue(shopMenu);

      await expect(shopService.getMenu('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(shopRepositoryMock.getMenu).toHaveBeenCalledWith('1');
    });
  });

  describe('Shop QrCodes', () => {
    it('should return all shop qrCodes', async () => {
      const shopQrCodes: QrCode[] = [
        {
          id: 1,
          shopId: 1,
          table: 1,
          isOccupied: false,
          qrCodeUrl:
            'https://image-charts.com/chart?chs=350x350&cht=qr&choe=UTF-8&icqrf=F3484F&chld=M&chl={"name":"tomo","tag":"romcom"}&chof=.png',
        },
        {
          id: 2,
          shopId: 1,
          table: 2,
          isOccupied: false,
          qrCodeUrl:
            'https://image-charts.com/chart?chs=350x350&cht=qr&choe=UTF-8&icqrf=F3484F&chld=M&chl={"name":"tomo","tag":"romcom"}&chof=.png',
        },
      ];

      shopRepositoryMock.getQrCodes.mockResolvedValue(shopQrCodes);

      const shopQrCodeFound = await shopService.getQrCodes('1');

      expect(shopRepositoryMock.getQrCodes).toHaveBeenCalledWith('1');

      expect(shopQrCodeFound).toEqual(shopQrCodes);
    });

    it('should throw a error if no shop found', async () => {
      shopRepositoryMock.getQrCodes.mockResolvedValue(undefined);

      await expect(shopService.getQrCodes('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(shopRepositoryMock.getQrCodes).toHaveBeenCalledWith('1');
    });

    it('should throw a error if the shop has no qrCode', async () => {
      const shopQrCodes = undefined;

      shopRepositoryMock.getQrCodes.mockResolvedValue(shopQrCodes);

      await expect(shopService.getQrCodes('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(shopRepositoryMock.getQrCodes).toHaveBeenCalledWith('1');
    });
  });

  describe('Shop Item Categories', () => {
    it('should return all shop item categories', async () => {
      const shopItemCategories: ItemCategory[] = [
        {
          shopId: 1,
          id: 1,
          name: 'Cold drinks',
        },
        {
          shopId: 1,
          id: 2,
          name: 'Hot drinks',
        },
      ];

      shopRepositoryMock.getItemCategories.mockResolvedValue(
        shopItemCategories,
      );

      const shopItemCategoriesFound = await shopService.getItemCategories('1');

      expect(shopRepositoryMock.getItemCategories).toHaveBeenCalledWith('1');

      expect(shopItemCategoriesFound).toEqual(shopItemCategories);
    });

    it('should throw a error if no shop found', async () => {
      shopRepositoryMock.getItemCategories.mockResolvedValue(undefined);

      await expect(shopService.getItemCategories('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(shopRepositoryMock.getItemCategories).toHaveBeenCalledWith('1');
    });

    it('should throw a error if the shop has no item categories', async () => {
      const shopItemCategories = undefined;

      shopRepositoryMock.getItemCategories.mockResolvedValue(
        shopItemCategories,
      );

      await expect(shopService.getItemCategories('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(shopRepositoryMock.getItemCategories).toHaveBeenCalledWith('1');
    });
  });

  describe('Shop Orders', () => {
    it('should return all shop orders', async () => {
      const shopOrders: Order[] = [
        {
          shopId: 1,
          id: 1,
          customerId: 1,
          status: 'open',
          itemId: 1,
          quantity: 5,
          tableId: 1,
          total: 558.78,
          groupId: 123456789,
        },
      ];

      shopRepositoryMock.getOrders.mockResolvedValue(shopOrders);

      const shopOrdersFound = await shopService.getOrders('1');

      expect(shopRepositoryMock.getOrders).toHaveBeenCalledWith('1');

      expect(shopOrdersFound).toEqual(shopOrders);
    });

    it('should throw a error if no shop found', async () => {
      shopRepositoryMock.getOrders.mockResolvedValue(undefined);

      await expect(shopService.getOrders('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(shopRepositoryMock.getOrders).toHaveBeenCalledWith('1');
    });

    it('should throw a error if the shop has no orders', async () => {
      const shopOrders = undefined;

      shopRepositoryMock.getOrders.mockResolvedValue(shopOrders);

      await expect(shopService.getOrders('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(shopRepositoryMock.getOrders).toHaveBeenCalledWith('1');
    });
  });

  describe('Shop Update', () => {
    const shopInfo: ShopUpdateType = {
      userId: 1,
      tables: 8,
    };

    const updatedShop: Shop = {
      addressId: 1,
      userId: 1,
      tables: 5,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    };
    it('should return the updated shop', async () => {
      shopRepositoryMock.exists.mockResolvedValue(true);
      shopRepositoryMock.update.mockResolvedValue(updatedShop);

      const shopUpdate = await shopService.update(shopInfo);

      expect(shopRepositoryMock.exists).toBeCalledWith(1);
      expect(shopRepositoryMock.update).toBeCalledWith(shopInfo);
      expect(shopUpdate).toHaveProperty('updatedAt');
    });

    it('should throw a error if no shop found with specified id', async () => {
      shopRepositoryMock.exists.mockResolvedValue(false);

      await expect(shopService.update(shopInfo)).rejects.toThrowError(
        NotFoundError,
      );

      expect(shopRepositoryMock.update).not.toBeCalled();
    });
  });
});
