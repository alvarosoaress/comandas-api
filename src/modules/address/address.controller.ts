/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import {
  type AddressGetType,
  type AddressCreateType,
  type AddressUpdateType,
} from './address.schema';
import { type AddressService } from './address.service';

export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  async getAddresses(req: Request, res: Response) {
    const addresses = await this.addressService.list();

    return res.status(200).json(addresses);
  }

  async createAddress(
    req: Request<unknown, unknown, AddressCreateType>,
    res: Response,
  ) {
    const newAddress = await this.addressService.create(req.body);

    return res.status(200).json(newAddress);
  }

  async getAddressById(req: Request<AddressGetType>, res: Response) {
    const { id } = req.params;

    const addressFound = await this.addressService.getById(parseInt(id));

    return res.status(200).json(addressFound);
  }

  async updateAddress(
    req: Request<unknown, unknown, AddressUpdateType>,
    res: Response,
  ) {
    const updatedAddress = await this.addressService.update(req.body);

    return res.status(200).json(updatedAddress);
  }
}
