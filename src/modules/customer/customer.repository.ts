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
import {
  type CustomerUpdateType,
  type CustomerCreateType,
} from './customer.schema';

export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly userService: UserService) {}

  async exists(userId: number): Promise<boolean> {
    const foundCustomer = await db.query.customer.findFirst({
      where: eq(customer.userId, userId),
    });

    return !!foundCustomer;
  }

  async create(
    info: CustomerCreateType,
  ): Promise<CustomerExtendedSafe | undefined> {
    const newUser = await this.userService.create({
      ...info.userInfo,
      role: 'customer',
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

  async update(
    newCostumerInfo: CustomerUpdateType,
  ): Promise<Customer | undefined> {
    newCostumerInfo.updatedAt = new Date();

    // Salvando e retirando userId de newCostumerInfo
    // para evitar o usuário atualizar o id do customer no BD
    const userId = newCostumerInfo.userId;

    deleteObjKey(newCostumerInfo, 'userId');

    await db
      .update(customer)
      .set(newCostumerInfo)
      .where(eq(customer.userId, userId));

    const updatedCustomer = await db.query.customer.findFirst({
      where: eq(customer.userId, userId),
    });

    return updatedCustomer;
  }
}