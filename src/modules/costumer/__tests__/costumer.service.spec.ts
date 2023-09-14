import { type CustomerExtended } from '../../../../database/schema';
import { NotFoundError } from '../../../helpers/api.erros';
import { type ICustomerRepository } from '../Icustomer.repository';
import { createCustomerType } from '../customer.schema';
import { CustomerService } from '../customer.service';

describe('Customer Service', () => {
  let customerService: CustomerService;
  let customerRepositoryMock: jest.Mocked<ICustomerRepository>;

  beforeEach(() => {
    customerRepositoryMock = {
      create: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
    };

    customerService = new CustomerService(customerRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const customerInfo: createCustomerType= {
    customerInfo:{

    }
    userInfo: {
      id: 1,
      name: 'Francesco Virgulini',
      email: 'maquinabeloz@tute.italia',
      password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
      role: 'shop' as const,
      refreshToken: 'nothingsafeandencryptedrefreshtokenold',
    },
  };

  describe('Create Shop', () => {
    it('should create a shop', async () => {
      customerRepositoryMock.create.mockResolvedValue(customerInfo);

      const newShop = await customerService.create(
        customerInfo.userInfo,
        customerInfo.addressInfo,
      );

      expect(customerRepositoryMock.create).toBeCalledWith(
        customerInfo.userInfo,
        customerInfo.addressInfo,
      );

      expect(newShop).not.toHaveProperty('password');
      expect(newShop).not.toHaveProperty('refreshToken');
    });

    describe('List Shop', () => {
      it('should return a list of shops', async () => {
        const shopList: CustomerExtended[] = [
          {
            userId: 1,
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
            userId: 2,
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
        customerRepositoryMock.list.mockResolvedValue(shopList);

        const shops = await customerService.list();

        expect(customerRepositoryMock.list).toHaveBeenCalled();

        expect(shops.length).toBeGreaterThanOrEqual(2);

        expect(shops).toBeInstanceOf(Array);
        expect(shops).toEqual(
          expect.arrayContaining<CustomerExtended>(shopList),
        );

        shops.forEach((shop) => {
          expect(shop.userInfo).not.toHaveProperty<CustomerExtended>(
            'password',
          );
          expect(shop.userInfo).not.toHaveProperty<CustomerExtended>(
            'refreshToken',
          );
          expect(shop.userInfo.role).toEqual('shop');
        });
      });

      it('should throw a error if no shops found', async () => {
        customerRepositoryMock.list.mockResolvedValue([]);

        await expect(customerService.list()).rejects.toThrowError(
          NotFoundError,
        );

        expect(customerRepositoryMock.list).toHaveBeenCalled();
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

        customerRepositoryMock.getMenu.mockResolvedValue(shopMenu);

        const shopMenuFound = await customerService.getMenu('1');

        expect(customerRepositoryMock.getMenu).toHaveBeenCalledWith('1');

        expect(shopMenuFound).toEqual(shopMenu);
      });

      it('should throw a error if no shop found', async () => {
        customerRepositoryMock.getMenu.mockResolvedValue(undefined);

        await expect(customerService.getMenu('1')).rejects.toThrowError(
          NotFoundError,
        );

        expect(customerRepositoryMock.getMenu).toHaveBeenCalledWith('1');
      });

      it('should throw a error if the shop has no menu', async () => {
        const shopMenu = undefined;

        customerRepositoryMock.getMenu.mockResolvedValue(shopMenu);

        await expect(customerService.getMenu('1')).rejects.toThrowError(
          NotFoundError,
        );

        expect(customerRepositoryMock.getMenu).toHaveBeenCalledWith('1');
      });
    });
  });
});
