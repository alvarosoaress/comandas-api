/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import { type CustomerService } from './customer.service';
import {
  type updateCustomerType,
  type createCustomerType,
} from './customer.schema';

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  async createCustomer(
    req: Request<unknown, unknown, createCustomerType>,
    res: Response,
  ) {
    const info: createCustomerType = {
      customerInfo: req.body.customerInfo,
      userInfo: req.body.userInfo,
    };

    const newCustomer = await this.customerService.create(info);

    return res.status(200).json({
      error: false,
      data: newCustomer,
    });
  }

  async getCustomers(req: Request, res: Response) {
    const customers = await this.customerService.list();

    return res.status(200).json({
      error: false,
      data: customers,
    });
  }

  async updateCustomer(
    req: Request<unknown, unknown, updateCustomerType>,
    res: Response,
  ) {
    const updatedCustomer = await this.customerService.update(req.body);

    return res.status(200).json({
      error: false,
      data: updatedCustomer,
    });
  }
}
