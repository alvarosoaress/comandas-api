import {
  type Customer,
  type CustomerExtendedSafe,
  type CustomerExtended,
} from '../../../database/schema';
import {
  type CustomerUpdateType,
  type CustomerCreateType,
} from './customer.schema';

export type ICustomerRepository = {
  exists: (userId: number) => Promise<boolean>;
  create: (
    info: CustomerCreateType,
  ) => Promise<CustomerExtendedSafe | undefined>;
  list: () => Promise<CustomerExtended[]>;
  update: (
    newCustomerInfo: CustomerUpdateType,
  ) => Promise<Customer | undefined>;
};
