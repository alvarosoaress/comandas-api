import { type OrderFormatted, type Order } from '../../../../database/schema';
import { ConflictError, NotFoundError } from '../../../helpers/api.erros';
import { type IOrderRepository } from '../Iorder.repository';
import { type OrderCreateType } from '../order.schema';
import { OrderService } from '../order.service';

let orderService: OrderService;
let orderRepositoryMock: jest.Mocked<IOrderRepository>;

beforeEach(() => {
  orderRepositoryMock = {
    exists: jest.fn(),
    shopExists: jest.fn(),
    create: jest.fn(),
    list: jest.fn(),
    getById: jest.fn(),
    getByTable: jest.fn(),
    complete: jest.fn(),
    customerExists: jest.fn(),
    existsById: jest.fn(),
    itemExists: jest.fn(),
    tableExists: jest.fn(),
    cancel: jest.fn(),
  };

  orderService = new OrderService(orderRepositoryMock);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Order Service', () => {
  const order: Order = {
    shopId: 1,
    id: 1,
    customerId: 1,
    status: 'open',
    itemId: 1,
    quantity: 5,
    tableId: 1,
    total: 558.78,
    groupId: 123456789,
  };

  const orderFormatted: OrderFormatted = {
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
        shopId: 1,
        categoryId: null,
        description: null,
        temperature: null,
        quantity: 1,
        total: 258.78,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ],
    total: 258.78,
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    note: null,
  };

  describe('Create order', () => {
    const newOrderInfo: OrderCreateType = [
      {
        customerId: 1,
        itemId: 1,
        quantity: 1,
        shopId: 1,
        tableId: 1,
        total: 588.78,
      },
    ];

    it('should return a new order', async () => {
      orderRepositoryMock.exists.mockResolvedValue(false);
      orderRepositoryMock.shopExists.mockResolvedValue(true);
      orderRepositoryMock.customerExists.mockResolvedValue(true);
      orderRepositoryMock.itemExists.mockResolvedValue(true);
      orderRepositoryMock.tableExists.mockResolvedValue(true);
      orderRepositoryMock.create.mockResolvedValue(orderFormatted);

      const newOrder = await orderService.create(newOrderInfo);

      expect(orderRepositoryMock.exists).toBeCalledWith(
        order.shopId,
        order.tableId,
      );
      expect(orderRepositoryMock.shopExists).toBeCalledWith(order.shopId);
      expect(orderRepositoryMock.customerExists).toBeCalledWith(
        order.customerId,
      );
      expect(orderRepositoryMock.itemExists).toBeCalledWith(order.itemId);
      expect(orderRepositoryMock.tableExists).toBeCalledWith(
        order.shopId,
        order.tableId,
      );
      expect(orderRepositoryMock.create).toBeCalledWith(newOrderInfo);
      expect(newOrder).toHaveProperty('groupId');
    });

    it('should throw a error if order already exists', async () => {
      orderRepositoryMock.exists.mockResolvedValue(true);

      await expect(orderService.create(newOrderInfo)).rejects.toThrowError(
        ConflictError,
      );

      expect(orderRepositoryMock.create).not.toBeCalled();
    });

    it('should throw a error if shop with specified id not exists', async () => {
      orderRepositoryMock.exists.mockResolvedValue(false);
      orderRepositoryMock.shopExists.mockResolvedValue(false);

      await expect(orderService.create(newOrderInfo)).rejects.toThrowError(
        NotFoundError,
      );

      expect(orderRepositoryMock.create).not.toBeCalled();
    });

    it('should throw a error if customer with specified id not exists', async () => {
      orderRepositoryMock.exists.mockResolvedValue(false);
      orderRepositoryMock.shopExists.mockResolvedValue(true);
      orderRepositoryMock.customerExists.mockResolvedValue(false);

      await expect(orderService.create(newOrderInfo)).rejects.toThrowError(
        NotFoundError,
      );

      expect(orderRepositoryMock.create).not.toBeCalled();
    });

    it('should throw a error if item with specified id not exists', async () => {
      orderRepositoryMock.exists.mockResolvedValue(false);
      orderRepositoryMock.shopExists.mockResolvedValue(true);
      orderRepositoryMock.customerExists.mockResolvedValue(true);
      orderRepositoryMock.itemExists.mockResolvedValue(false);

      await expect(orderService.create(newOrderInfo)).rejects.toThrowError(
        NotFoundError,
      );

      expect(orderRepositoryMock.create).not.toBeCalled();
    });

    it('should throw a error if table with specified id not exists', async () => {
      orderRepositoryMock.exists.mockResolvedValue(false);
      orderRepositoryMock.shopExists.mockResolvedValue(true);
      orderRepositoryMock.customerExists.mockResolvedValue(true);
      orderRepositoryMock.itemExists.mockResolvedValue(true);
      orderRepositoryMock.tableExists.mockResolvedValue(false);

      await expect(orderService.create(newOrderInfo)).rejects.toThrowError(
        NotFoundError,
      );

      expect(orderRepositoryMock.create).not.toBeCalled();
    });
  });

  describe('List order', () => {
    const orders: Order[] = [
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
      {
        shopId: 1,
        id: 2,
        customerId: 1,
        status: 'open',
        itemId: 2,
        quantity: 5,
        tableId: 2,
        total: 558.78,
        groupId: 123456789,
      },
    ];
    it('should return all orders', async () => {
      orderRepositoryMock.list.mockResolvedValue(orders);

      const orderList = await orderService.list();

      expect(orderRepositoryMock.list).toHaveBeenCalled();
      expect(orderList).toBeInstanceOf(Array);
      expect(orderList).toMatchObject(orders);
    });

    it('should throw a error if no orders found', async () => {
      orderRepositoryMock.list.mockResolvedValue([]);

      await expect(orderService.list()).rejects.toThrowError(NotFoundError);

      expect(orderRepositoryMock.list).toHaveBeenCalled();
    });
  });

  describe('Get By Id Order', () => {
    it('should return the order with the specified group id', async () => {
      orderRepositoryMock.existsById.mockResolvedValue(true);
      orderRepositoryMock.getById.mockResolvedValue(orderFormatted);

      const orderFound = await orderService.getById('1');

      expect(orderRepositoryMock.getById).toHaveBeenCalledWith('1');
      expect(orderRepositoryMock.existsById).toHaveBeenCalledWith('1');
      expect(orderFound).toHaveProperty('groupId');
    });

    it('should throw a error if no order found with the specified group id', async () => {
      orderRepositoryMock.existsById.mockResolvedValue(false);

      await expect(orderService.getById('1')).rejects.toThrowError(
        NotFoundError,
      );
    });
  });

  describe('Get By Table Id Order', () => {
    it('should return the order with the specified table id', async () => {
      orderRepositoryMock.getByTable.mockResolvedValue(orderFormatted);

      const orderFound = await orderService.getByTable('1');

      expect(orderRepositoryMock.getByTable).toHaveBeenCalledWith('1');
      expect(orderFound).toHaveProperty('tableId');
      expect(orderFound?.tableId).toEqual(1);
    });

    it('should throw a error if no order found with the specified table id', async () => {
      orderRepositoryMock.getByTable.mockResolvedValue(undefined);

      await expect(orderService.getById('1')).rejects.toThrowError(
        NotFoundError,
      );
    });
  });

  describe('Complete order', () => {
    it('should return the completed order', async () => {
      const completedOrderRes: OrderFormatted = {
        ...orderFormatted,
        status: 'closed',
      };

      orderRepositoryMock.existsById.mockResolvedValue(true);
      orderRepositoryMock.complete.mockResolvedValue(completedOrderRes);

      const completedOrder = await orderService.completeOrder({
        groupId: '123456789',
      });

      expect(orderRepositoryMock.existsById).toHaveBeenCalledWith('123456789');
      expect(completedOrder).toHaveProperty('groupId');
      expect(completedOrder?.status).toEqual('closed');
      expect(completedOrder).toEqual(completedOrderRes);
    });

    it('should trhow a error if no order found with specified group id', async () => {
      orderRepositoryMock.existsById.mockResolvedValue(false);

      await expect(
        orderService.completeOrder({
          groupId: '123456789',
        }),
      ).rejects.toThrowError(NotFoundError);

      expect(orderRepositoryMock.complete).not.toHaveBeenCalled();
    });
  });

  describe('Cancel order', () => {
    it('should return the cancelled order', async () => {
      const cancelledOrderRes: OrderFormatted = {
        ...orderFormatted,
        status: 'closed',
      };

      orderRepositoryMock.existsById.mockResolvedValue(true);
      orderRepositoryMock.cancel.mockResolvedValue(cancelledOrderRes);

      const cancelledOrder = await orderService.cancelOrder({
        groupId: '123456789',
      });

      expect(orderRepositoryMock.existsById).toHaveBeenCalledWith('123456789');
      expect(cancelledOrder).toHaveProperty('groupId');
      expect(cancelledOrder?.status).toEqual('closed');
      expect(cancelledOrder).toEqual(cancelledOrderRes);
    });

    it('should trhow a error if no order found with specified group id', async () => {
      orderRepositoryMock.existsById.mockResolvedValue(false);

      await expect(
        orderService.cancelOrder({
          groupId: '123456789',
        }),
      ).rejects.toThrowError(NotFoundError);

      expect(orderRepositoryMock.complete).not.toHaveBeenCalled();
    });
  });
});
