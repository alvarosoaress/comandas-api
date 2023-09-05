import { type Address } from '../../../../database/schema';
import { ConflictError, NotFoundError } from '../../../helpers/api.erros';
import { AddressService } from './../address.service';
import { type IAddressRepository } from './../Iaddress.repository';

describe('Address Service', () => {
  let addressService: AddressService;
  let addressRepositoryMock: jest.Mocked<IAddressRepository>;

  beforeEach(() => {
    addressRepositoryMock = {
      create: jest.fn(),
      list: jest.fn(),
      getById: jest.fn(),
      exists: jest.fn(),
    };
    addressService = new AddressService(addressRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Address', () => {
    it('should create a new address', async () => {
      const addressInfo = {
        number: 69,
        street: 'Virgulini',
        neighborhood: 'Francesco',
        city: 'City Test',
        state: 'Tute',
        country: 'Italia',
      };

      addressRepositoryMock.exists.mockResolvedValue(false);
      addressRepositoryMock.create.mockResolvedValue({ ...addressInfo, id: 1 });

      const newAddress = await addressService.create(addressInfo);

      expect(addressRepositoryMock.exists).toHaveBeenCalledWith(addressInfo);
      expect(addressRepositoryMock.create).toHaveBeenCalledWith(addressInfo);

      expect(newAddress).toHaveProperty<Address>('id');
    });

    it('should throw an error if the address already exists', async () => {
      const addressInfo = {
        city: 'City Test',
        neighborhood: 'Francesco',
        number: 69,
        street: 'Virgulini',
        state: 'Tute',
        country: 'Italia',
      };
      addressRepositoryMock.exists.mockResolvedValue(true);

      await expect(addressService.create(addressInfo)).rejects.toThrowError(
        ConflictError,
      );

      expect(addressRepositoryMock.exists).toHaveBeenCalledWith(addressInfo);
      expect(addressRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('List Address', () => {
    it('should return a list of addresses', async () => {
      const addressList = [
        {
          id: 45,
          city: 'City Test',
          neighborhood: 'Francesco',
          number: 69,
          street: 'Virgulini',
          state: 'Tute',
          country: 'Italia',
          zipcode: 48564564,
          lat: '454.788.87',
          long: '454.788.87',
          createdAt: new Date('2022-03-25'),
        },
        {
          id: 1,
          city: 'City Test',
          neighborhood: 'Francesco',
          number: 69,
          street: 'Virgulini',
          state: 'Tute',
          country: 'Italia',
          createdAt: new Date('2022-03-25'),
        },
        {
          id: 22,
          city: 'City Test',
          neighborhood: 'Francesco',
          number: 69,
          street: 'Virgulini',
          state: 'Tute',
          country: 'Italia',
          lat: '454.788.87',
          long: '454.788.87',
          createdAt: new Date('2022-03-25'),
        },
      ];
      addressRepositoryMock.list.mockResolvedValue(addressList);

      const addresses = await addressService.list();

      expect(addressRepositoryMock.list).toHaveBeenCalled();

      expect(addresses).toEqual(expect.arrayContaining<Address>(addressList));
    });

    it('should throw an error if no addresses are found', async () => {
      addressRepositoryMock.list.mockResolvedValue([]);

      await expect(addressService.list()).rejects.toThrowError(NotFoundError);

      expect(addressRepositoryMock.list).toHaveBeenCalled();
    });
  });

  describe('GetById Address', () => {
    it('should return the address with the specified ID', async () => {
      const address = {
        id: 1,
        city: 'City Test',
        neighborhood: 'Francesco',
        number: 69,
        street: 'Virgulini',
        state: 'Tute',
        country: 'Italia',
      };
      addressRepositoryMock.getById.mockResolvedValue(address);

      const result = await addressService.getById(1);

      expect(addressRepositoryMock.getById).toHaveBeenCalledWith(1);

      expect(result).toEqual<Address>(address);
    });
    it('should throw an error if no address is found with the specified ID', async () => {
      addressRepositoryMock.getById.mockResolvedValue(undefined);

      await expect(addressService.getById(2)).rejects.toThrowError(
        NotFoundError,
      );
    });
  });
});
