import {
  type Customer,
  type CustomerExtendedSafe,
  type CustomerExtended,
} from '../../../database/schema';
import { type createCustomerType } from './customer.schema';

export type ICustomerRepository = {
  create: (
    info: createCustomerType,
  ) => Promise<CustomerExtendedSafe | undefined>;
  list: () => Promise<CustomerExtended[]>;
  update: (newCustomerInfo: Customer) => Promise<Customer | undefined>;
};
