import {
  type CustomerExtendedSafe,
  type Customer,
  type OrderFormatted,
} from '../../../database/schema';
import { InternalServerError, NotFoundError } from '../../helpers/api.erros';
import { deleteObjKey } from '../../utils';
import { type ICustomerRepository } from './Icustomer.repository';
import {
  type CustomerUpdateType,
  type CustomerCreateType,
} from './customer.schema';

export class CustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async create(info: CustomerCreateType): Promise<CustomerExtendedSafe> {
    const newCustomer = await this.customerRepository.create(info);

    if (!newCustomer) throw new InternalServerError();

    return newCustomer;
  }

  async list(): Promise<CustomerExtendedSafe[]> {
    const customers = await this.customerRepository.list();

    if (!customers || customers.length < 1)
      throw new NotFoundError('No customers found');

    customers.forEach((shop) => {
      deleteObjKey(shop.userInfo, 'password');
      deleteObjKey(shop.userInfo, 'refreshToken');
    });

    return customers;
  }

  async getOrders(userId: string): Promise<OrderFormatted[] | undefined> {
    const customerOrders = await this.customerRepository.getOrders(userId);

    if (!customerOrders) throw new NotFoundError('No customer found');

    if (!customerOrders || customerOrders.length < 1)
      throw new NotFoundError('Customer has no orders');

    return customerOrders;
  }

  async update(
    newCustomerInfo: CustomerUpdateType,
  ): Promise<Customer | undefined> {
    const customerExists = await this.customerRepository.exists(
      newCustomerInfo.userId,
    );

    if (!customerExists) throw new NotFoundError('No customer found');

    const updatedCustomer =
      await this.customerRepository.update(newCustomerInfo);

    if (!updatedCustomer) throw new InternalServerError();

    return updatedCustomer;
  }
}
