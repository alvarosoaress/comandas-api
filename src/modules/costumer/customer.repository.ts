import { eq } from 'drizzle-orm';
import { db } from '../../../database';
import {
  customer,
  type CustomerExtendedSafe,
  type CustomerExtended,
  type Customer,
} from '../../../database/schema';
import { type UserService } from '../user/user.service';
import deleteObjKey from '../../utils';
import { type ICustomerRepository } from './Icustomer.repository';
import { type createCustomerType } from './customer.schema';

export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly userService: UserService) {}

  async create(
    info: createCustomerType,
  ): Promise<CustomerExtendedSafe | undefined> {
    const newUser = await this.userService.create({
      ...info.userInfo,
      role: 'client',
    });

    if (!newUser) return undefined;

    await db
      .insert(customer)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .values({ ...info.customerInfo, userId: newUser.id! });

    return {
      ...info.customerInfo,
      userId: newUser.id as number,
      userInfo: newUser,
    };
  }

  async list(): Promise<CustomerExtended[]> {
    const customers = await db.query.customer.findMany({
      with: {
        userInfo: true,
      },
    });

    return customers;
  }

  async update(newCostumerInfo: Customer): Promise<Customer | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain

    // Não há motivos para sobreescrever o createdAt
    if (newCostumerInfo.createdAt) deleteObjKey(newCostumerInfo, 'createdAt');

    newCostumerInfo.updatedAt = new Date();

    await db
      .update(customer)
      .set(newCostumerInfo)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .where(eq(customer.userId, newCostumerInfo.userId!));

    const updatedCustomer = await db.query.customer.findFirst({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      where: eq(customer.userId, newCostumerInfo.userId!),
    });

    return updatedCustomer;
  }
}
