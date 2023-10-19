/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import { type CustomerService } from './customer.service';
import {
  type CustomerUpdateType,
  type CustomerCreateType,
  type CustomerGetOrderType,
} from './customer.schema';
import verifyOwnership from '../../middleware/verifyOwnership';
import { genericOwnership } from '../../middleware/ownership';

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  async createCustomer(
    req: Request<unknown, unknown, CustomerCreateType>,
    res: Response,
  ) {
    const info: CustomerCreateType = {
      customerInfo: req.body.customerInfo,
      userInfo: req.body.userInfo,
    };

    const newCustomer = await this.customerService.create(info);

    return res.status(200).json(newCustomer);
  }

  async getCustomers(req: Request, res: Response) {
    const customers = await this.customerService.list();

    return res.status(200).json(customers);
  }

  async getCustomerOrders(req: Request<CustomerGetOrderType>, res: Response) {
    verifyOwnership(genericOwnership(req.user.id, req.params.id), req);

    const shopOrders = await this.customerService.getOrders(req.params.id);

    return res.status(200).json(shopOrders);
  }

  async updateCustomer(
    req: Request<unknown, unknown, CustomerUpdateType>,
    res: Response,
  ) {
    const updatedCustomer = await this.customerService.update(req.body);

    return res.status(200).json(updatedCustomer);
  }
}
