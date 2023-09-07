import { type ShopMenu, type Shop } from '../../../../database/schema';
import { ConflictError, NotFoundError } from '../../../helpers/api.erros';
import { type IShopRepository } from '../Ishop.repository';
import { ShopService } from '../shop.service';

describe('Shop Service', () => {
  let shopService: ShopService;
  let shopRepositoryMock: jest.Mocked<IShopRepository>;

  beforeEach(() => {
    shopRepositoryMock = {
      exists: jest.fn(),
      existsAddress: jest.fn(),
      create: jest.fn(),
      list: jest.fn(),
      getById: jest.fn(),
      getMenu: jest.fn(),
    };

    shopService = new ShopService(shopRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const shopInfo: Shop = {
    id: 1,
    name: 'Francesco Virgulini',
    email: 'maquinabeloz@tute.italia',
    password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
    role: 'shop' as const,
    refreshToken: 'nothingsafeandencryptedrefreshtokenold',
    address: {
      id: 1,
      city: 'City Test',
      neighborhood: 'Francesco',
      number: 69,
      street: 'Virgulini',
      state: 'Tute',
      country: 'Italia',
    },
  };

  describe('Create Shop', () => {
    it('should create a shop', async () => {
      shopRepositoryMock.exists.mockResolvedValue(false);
      shopRepositoryMock.create.mockResolvedValue(shopInfo);
      shopRepositoryMock.existsAddress.mockResolvedValue(true);

      const newShop = await shopService.create(1, 1);

      expect(shopRepositoryMock.exists).toBeCalledWith(1);
      expect(shopRepositoryMock.create).toBeCalledWith(1, 1);

      expect(newShop).not.toHaveProperty('password');
      expect(newShop).not.toHaveProperty('refreshToken');
    });

    it('should throw a error if the shop exists', async () => {
      shopRepositoryMock.exists.mockResolvedValue(true);

      await expect(shopService.create(1, 1)).rejects.toThrowError(
        ConflictError,
      );

      expect(shopRepositoryMock.exists).toBeCalledWith(1);

      expect(shopRepositoryMock.create).not.toBeCalled();
    });

    it('should throw a error if the address not exists', async () => {
      shopRepositoryMock.exists.mockResolvedValue(false);
      shopRepositoryMock.existsAddress.mockResolvedValue(false);

      await expect(shopService.create(1, 2)).rejects.toThrowError(
        NotFoundError,
      );

      expect(shopRepositoryMock.exists).toBeCalledWith(1);

      expect(shopRepositoryMock.existsAddress).toBeCalledWith(2);

      expect(shopRepositoryMock.create).not.toBeCalled();
    });
  });

  describe('GetById Shop', () => {
    it('should return the shop with the specified ID', async () => {
      shopRepositoryMock.getById.mockResolvedValue(shopInfo);

      const shopFound = await shopService.getById('1');

      expect(shopRepositoryMock.getById).toHaveBeenCalledWith('1');

      expect(shopFound).toEqual(shopInfo);

      expect(shopFound).not.toHaveProperty('password');
      expect(shopFound).not.toHaveProperty('refreshToken');
    });

    it('should throw a error if no shop found', async () => {
      shopRepositoryMock.getById.mockResolvedValue(undefined);

      await expect(shopService.getById('1')).rejects.toThrowError(
        NotFoundError,
      );
    });
  });

  describe('List Shop', () => {
    it('should return a list of shops', async () => {
      const shopList: Shop[] = [
        {
          id: 1,
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
          role: 'shop' as const,
          refreshToken: 'nothingsafeandencryptedrefreshtokenold',
          address: {
            id: 1,
            city: 'City Test',
            neighborhood: 'Francesco',
            number: 69,
            street: 'Virgulini',
            state: 'Tute',
            country: 'Italia',
          },
        },
        {
          id: 2,
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
          role: 'shop' as const,
          refreshToken: 'nothingsafeandencryptedrefreshtokenold',
          address: {
            id: 7,
            city: 'City Test',
            neighborhood: 'Francesco',
            number: 69,
            street: 'Virgulini',
            state: 'Tute',
            country: 'Italia',
          },
        },
      ];
      shopRepositoryMock.list.mockResolvedValue(shopList);

      const shops = await shopService.list();

      expect(shopRepositoryMock.list).toHaveBeenCalled();

      expect(shops.length).toBeGreaterThanOrEqual(2);

      expect(shops).toBeInstanceOf(Array);
      expect(shops).toEqual(expect.arrayContaining<Shop>(shopList));

      shops.forEach((Shop) => {
        expect(Shop).not.toHaveProperty<Shop>('password');
        expect(Shop).not.toHaveProperty<Shop>('refreshToken');
      });
    });

    it('should throw a error if no shops found', async () => {
      shopRepositoryMock.list.mockResolvedValue([]);

      await expect(shopService.list()).rejects.toThrowError(NotFoundError);

      expect(shopRepositoryMock.list).toHaveBeenCalled();
    });
  });

  describe('Shop Menu', () => {
    it('should return shop id, name and menu', async () => {
      const shopMenu: ShopMenu = {
        id: 1,
        name: 'Francesco Virgulini',
        items: [
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
        ],
      };

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
      const shopMenu = {
        id: 1,
        name: 'Francesco Virgulini',
        items: [],
      };
      shopRepositoryMock.getMenu.mockResolvedValue(shopMenu);

      await expect(shopService.getMenu('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(shopRepositoryMock.getMenu).toHaveBeenCalledWith('1');
    });
  });
});
