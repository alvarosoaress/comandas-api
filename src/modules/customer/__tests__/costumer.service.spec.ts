import {
  type CustomerExtendedSafe,
  type CustomerExtended,
  type Customer,
  type OrderFormatted,
} from '../../../../database/schema';
import { NotFoundError } from '../../../helpers/api.erros';
import { type ICustomerRepository } from '../Icustomer.repository';
import { type CustomerCreateType } from '../customer.schema';
import { CustomerService } from '../customer.service';

describe('Customer Service', () => {
  let customerService: CustomerService;
  let customerRepositoryMock: jest.Mocked<ICustomerRepository>;

  beforeEach(() => {
    customerRepositoryMock = {
      exists: jest.fn(),
      create: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      getOrders: jest.fn(),
    };

    customerService = new CustomerService(customerRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const customerInfo: CustomerCreateType = {
    customerInfo: {
      photoUrl: 'https://animesisfun.eww',
    },
    userInfo: {
      name: 'Francesco Virgulini',
      email: 'maquinabeloz@tute.italia',
      password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
      role: 'customer' as const,
    },
  };

  const customerResult: CustomerExtendedSafe = {
    userId: 1,
    photoUrl: 'https://animesisfun.eww',
    userInfo: {
      id: 1,
      name: 'Francesco Virgulini',
      email: 'maquinabeloz@tute.italia',
      role: 'customer' as const,
    },
  };

  describe('Create Customer', () => {
    it('should create a customer', async () => {
      customerRepositoryMock.create.mockResolvedValue(customerResult);

      const newCustomer = await customerService.create(customerInfo);

      expect(customerRepositoryMock.create).toBeCalledWith(customerInfo);

      expect(newCustomer).not.toHaveProperty('password');
      expect(newCustomer).not.toHaveProperty('refreshToken');
    });
  });

  describe('Customer Orders', () => {
    it('should return all customer orders', async () => {
      const customerOrders: OrderFormatted[] = [
        {
          shop: {
            userId: 1,
            addressId: 1,
            tables: 10,
            photoUrl: 'https://i.imgur.com/zFdjr3E.jpg',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            userInfo: {
              id: 1,
              name: 'Mexirica & C.A',
              email: 'user1@email.com',
              phoneNumber: 123456,
              role: 'shop',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            addressInfo: {
              id: 1,
              street: '123 Main St',
              number: 1,
              neighborhood: 'Downtown',
              city: 'Cityville',
              state: 'Stateville',
              country: 'Countryland',
              zipcode: 12345,
              lat: '12.345',
              long: '67.890',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
          groupId: expect.any(Number),
          tableId: 1,
          id: 1,
          customer: {
            userId: 2,
            photoUrl: null,
            birthday: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            userInfo: {
              id: 2,
              name: 'Breno',
              email: 'breno@gmail.com',
              phoneNumber: null,
              role: 'customer',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
          status: 'open',
          items: [
            {
              id: 1,
              name: 'Bolinea de Gorfwe',
              price: 258.78,
              shopId: 1,
              categoryId: null,
              description: null,
              temperature: null,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          ],
          total: 258.78,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          note: null,
        },
      ];

      customerRepositoryMock.getOrders.mockResolvedValue(customerOrders);

      const customerOrdersFound = await customerService.getOrders('1');

      expect(customerRepositoryMock.getOrders).toHaveBeenCalledWith('1');

      expect(customerOrdersFound).toEqual(customerOrders);
    });

    it('should throw a error if no customer found', async () => {
      customerRepositoryMock.getOrders.mockResolvedValue(undefined);

      await expect(customerService.getOrders('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(customerRepositoryMock.getOrders).toHaveBeenCalledWith('1');
    });

    it('should throw a error if the customer has no orders', async () => {
      const customerOrders = undefined;

      customerRepositoryMock.getOrders.mockResolvedValue(customerOrders);

      await expect(customerService.getOrders('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(customerRepositoryMock.getOrders).toHaveBeenCalledWith('1');
    });
  });

  describe('List Customer', () => {
    it('should return a list of customers', async () => {
      const customerList: CustomerExtended[] = [
        {
          userId: 1,
          photoUrl: 'https://animesisfun.eww',
          userInfo: {
            id: 1,
            name: 'Francesco Virgulini',
            email: 'maquinabeloz@tute.italia',
            role: 'customer' as const,
            password:
              'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
            refreshToken: 'nothingsafeandencryptedrefreshtokenold',
          },
        },
        {
          userId: 2,
          photoUrl: 'https://getalife.pls',
          userInfo: {
            id: 2,
            name: 'Francesco Virgulini',
            email: 'maquinabeloz@tute.italia',
            role: 'customer' as const,
            password:
              'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
            refreshToken: 'nothingsafeandencryptedrefreshtokenold',
          },
        },
      ];
      customerRepositoryMock.list.mockResolvedValue(customerList);

      const customers = await customerService.list();

      expect(customerRepositoryMock.list).toHaveBeenCalled();

      expect(customers.length).toBeGreaterThanOrEqual(2);

      expect(customers).toBeInstanceOf(Array);
      expect(customers).toEqual(
        expect.arrayContaining<CustomerExtended>(customerList),
      );

      customers.forEach((customer) => {
        expect(customer.userInfo).not.toHaveProperty<CustomerExtended>(
          'password',
        );
        expect(customer.userInfo).not.toHaveProperty<CustomerExtended>(
          'refreshToken',
        );
        expect(customer.userInfo.role).toEqual('customer');
      });
    });

    it('should throw a error if no customers found', async () => {
      customerRepositoryMock.list.mockResolvedValue([]);

      await expect(customerService.list()).rejects.toThrowError(NotFoundError);

      expect(customerRepositoryMock.list).toHaveBeenCalled();
    });
  });

  describe('Update Customer', () => {
    const newCostumerInfo: Customer = {
      userId: 1,
      photoUrl: 'https://animeisnotfun.anymore',
    };
    it('should return the updated customer', async () => {
      const updatedCustomer: Customer = {
        userId: 1,
        photoUrl: 'https://animeisnotfun.anymore',
        birthday: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: new Date(),
      };
      customerRepositoryMock.exists.mockResolvedValue(true);
      customerRepositoryMock.update.mockResolvedValue(updatedCustomer);

      const updateResult = await customerService.update(newCostumerInfo);

      expect(customerRepositoryMock.update).toBeCalledWith(newCostumerInfo);

      expect(updateResult).toHaveProperty('updatedAt');
    });

    it('should trhow a error if no customer found', async () => {
      customerRepositoryMock.exists.mockResolvedValue(false);

      await expect(
        customerService.update(newCostumerInfo),
      ).rejects.toThrowError(NotFoundError);
    });
  });
});
