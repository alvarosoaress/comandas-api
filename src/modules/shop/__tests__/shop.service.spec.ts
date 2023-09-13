import { type Item, type Shop } from '../../../../database/schema';
import { NotFoundError } from '../../../helpers/api.erros';
import { type IShopRepository } from '../Ishop.repository';
import { ShopService } from '../shop.service';

describe('Shop Service', () => {
  let shopService: ShopService;
  let shopRepositoryMock: jest.Mocked<IShopRepository>;

  beforeEach(() => {
    shopRepositoryMock = {
      create: jest.fn(),
      list: jest.fn(),
      getMenu: jest.fn(),
    };

    shopService = new ShopService(shopRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const shopInfo: Shop = {
    userInfo: {
      id: 1,
      name: 'Francesco Virgulini',
      email: 'maquinabeloz@tute.italia',
      password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
      role: 'shop' as const,
      refreshToken: 'nothingsafeandencryptedrefreshtokenold',
    },
    addressId: 1,
    addressInfo: {
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
      shopRepositoryMock.create.mockResolvedValue(shopInfo);

      const newShop = await shopService.create(
        shopInfo.userInfo,
        shopInfo.addressInfo,
      );

      expect(shopRepositoryMock.create).toBeCalledWith(
        shopInfo.userInfo,
        shopInfo.addressInfo,
      );

      expect(newShop).not.toHaveProperty('password');
      expect(newShop).not.toHaveProperty('refreshToken');
    });

    describe('List Shop', () => {
      it('should return a list of shops', async () => {
        const shopList: Shop[] = [
          {
            userInfo: {
              id: 1,
              name: 'Francesco Virgulini',
              email: 'maquinabeloz@tute.italia',
              password:
                'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
              role: 'shop' as const,
              refreshToken: 'nothingsafeandencryptedrefreshtokenold',
            },
            addressId: 1,
            addressInfo: {
              city: 'City Test',
              neighborhood: 'Francesco',
              number: 69,
              street: 'Virgulini',
              state: 'Tute',
              country: 'Italia',
            },
          },
          {
            userInfo: {
              id: 2,
              name: 'Francesco Virgulini',
              email: 'maquinabeloz@tute.italia',
              password:
                'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
              role: 'shop' as const,
              refreshToken: 'nothingsafeandencryptedrefreshtokenold',
            },
            addressId: 2,
            addressInfo: {
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

        shops.forEach((shop) => {
          expect(shop.userInfo).not.toHaveProperty<Shop>('password');
          expect(shop.userInfo).not.toHaveProperty<Shop>('refreshToken');
          expect(shop.userInfo.role).toEqual('shop');
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
  });
});
