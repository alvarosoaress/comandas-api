/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import { type AddressGetType, type AddressCreateType } from './address.schema';
import { type AddressService } from './address.service';

export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  async getAddresses(req: Request, res: Response) {
    const addresses = await this.addressService.list();

    return res.status(200).json({
      error: false,
      data: addresses,
    });
  }

  async createAddress(
    req: Request<unknown, unknown, AddressCreateType>,
    res: Response,
  ) {
    const newAddress = await this.addressService.create(req.body);

    return res.status(200).json({
      error: false,
      data: newAddress,
    });
  }

  async getAddressById(req: Request<AddressGetType>, res: Response) {
    const { id } = req.params;

    const addressFound = await this.addressService.getById(parseInt(id));

    return res.status(200).json({
      error: false,
      data: addressFound,
    });
  }
}
