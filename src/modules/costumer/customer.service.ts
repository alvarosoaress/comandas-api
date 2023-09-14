import {
  type CustomerExtendedSafe,
  type Customer,
} from '../../../database/schema';
import { InternalServerError, NotFoundError } from '../../helpers/api.erros';
import deleteObjKey from '../../utils';
import { type ICustomerRepository } from './Icustomer.repository';
import { type createCustomerType } from './customer.schema';

export class CustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async create(info: createCustomerType): Promise<CustomerExtendedSafe> {
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

  async update(newCustomerInfo: Customer): Promise<Customer | undefined> {
    const updatedCustomer =
      await this.customerRepository.update(newCustomerInfo);

    if (!updatedCustomer) throw new NotFoundError('No customer found');

    return updatedCustomer;
  }
}
