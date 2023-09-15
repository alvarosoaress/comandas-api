import {
  type CustomerExtendedSafe,
  type CustomerExtended,
  type Customer,
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
