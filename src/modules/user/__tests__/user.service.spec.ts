import {
  type ShopExtended,
  type CustomerExtended,
  type User,
} from '../../../../database/schema';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '../../../helpers/api.erros';
import { type IUserRepository } from '../Iuser.repository';
import { UserService } from '../user.service';
import bcrypt from 'bcryptjs';
import jwt, { type Secret } from 'jsonwebtoken';

describe('User Service', () => {
  const bcryptMock = {
    hash: jest.fn(),
    compare: jest.fn(),
  };
  const jwtMock = {
    sign: jest.fn(),
    decode: jest.fn(),
  };
  (bcrypt.compare as jest.Mock) = bcryptMock.compare;
  (bcrypt.hash as jest.Mock) = bcryptMock.hash;
  (jwt.sign as jest.Mock) = jwtMock.sign;
  (jwt.decode as jest.Mock) = jwtMock.decode;
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepositoryMock = {
      exists: jest.fn(),
      create: jest.fn(),
      list: jest.fn(),
      getByEmail: jest.fn(),
      getById: jest.fn(),
      updateRefreshToken: jest.fn(),
      getRefreshToken: jest.fn(),
      update: jest.fn(),
      existsById: jest.fn(),
    };
    userService = new UserService(userRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create User', () => {
    const userInfo = {
      name: 'Francesco Virgulini',
      email: 'maquinabeloz@tute.italia',
      password: 'supersafepasswordnobodywillnowhihi123',
      role: 'customer' as const,
    };
    it('should create a user', async () => {
      userRepositoryMock.exists.mockResolvedValue(false);
      userRepositoryMock.create.mockResolvedValue({ ...userInfo, id: 1 });

      const newUser = await userService.create(userInfo);

      expect(userRepositoryMock.exists).toHaveBeenCalledWith(userInfo.email);
      expect(userRepositoryMock.create).toHaveBeenCalledWith(userInfo);

      expect(bcryptMock.hash).toBeCalledWith(
        'supersafepasswordnobodywillnowhihi123',
        10,
      );

      expect(newUser).toHaveProperty<User>('id');
      expect(newUser).not.toHaveProperty<User>('password');
    });

    it('should throw a error if the user exists', async () => {
      userRepositoryMock.exists.mockResolvedValue(true);

      await expect(userService.create(userInfo)).rejects.toThrowError(
        ConflictError,
      );

      expect(userRepositoryMock.exists).toHaveBeenCalledWith(userInfo.email);
      expect(userRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('List Users', () => {
    it('should return a list of users', async () => {
      const userList: User[] = [
        {
          id: 1,
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
          role: 'customer' as const,
          phoneNumber: 4578784,
        },
        {
          id: 2,
          name: 'Antoniio Haaland',
          email: 'maquinabeloz@tute.italia',
          password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
          role: 'shop' as const,
        },
        {
          id: 3,
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
          role: 'customer' as const,
        },
      ];

      userRepositoryMock.list.mockResolvedValue(userList);

      const users = await userService.list();

      expect(userRepositoryMock.list).toHaveBeenCalled();
      expect(users).toEqual(expect.arrayContaining<User>(userList));

      users.forEach((user) => {
        expect(user).not.toHaveProperty<User>('password');
        expect(user).not.toHaveProperty<User>('refreshToken');
      });
    });

    it('should throw a error if no users found', async () => {
      userRepositoryMock.list.mockResolvedValue([]);

      await expect(userService.list()).rejects.toThrowError(NotFoundError);

      expect(userRepositoryMock.list).toHaveBeenCalled();
    });
  });

  describe('GetById User', () => {
    it('should return the CUSTOMER with the specified ID', async () => {
      const userInfo: CustomerExtended = {
        userId: 1,
        userInfo: {
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
          role: 'customer' as const,
        },
      };

      userRepositoryMock.getById.mockResolvedValue(userInfo);

      const userFound = await userService.getById('1');

      expect(userRepositoryMock.getById).toHaveBeenCalledWith('1');

      expect(userFound).toEqual<CustomerExtended>(userInfo);

      expect(userFound.userInfo.role).toEqual('customer');

      expect(userFound).not.toHaveProperty<User>('password');
      expect(userFound).not.toHaveProperty<User>('refreshToken');
    });

    it('should return the SHOP with the specified ID', async () => {
      const userInfo: ShopExtended = {
        userId: 1,
        addressId: 1,
        addressInfo: {
          number: 69,
          street: 'Virgulini',
          neighborhood: 'Francesco',
          city: 'City Test',
          state: 'Tute',
          country: 'Italia',
        },
        userInfo: {
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
          role: 'shop' as const,
        },
      };

      userRepositoryMock.getById.mockResolvedValue(userInfo);

      const userFound = await userService.getById('1');

      expect(userRepositoryMock.getById).toHaveBeenCalledWith('1');

      expect(userFound).toEqual<ShopExtended>(userInfo);

      expect(userFound.userInfo.role).toEqual('shop');

      expect(userFound).not.toHaveProperty<User>('password');
      expect(userFound).not.toHaveProperty<User>('refreshToken');
    });

    it('should throw a error if no user found', async () => {
      userRepositoryMock.getById.mockResolvedValue(undefined);

      await expect(userService.getById('2')).rejects.toThrowError(
        NotFoundError,
      );
    });
  });

  describe('GetByEmail User', () => {
    it('should return the CUSTOMER with the specified Email', async () => {
      const userInfo: CustomerExtended = {
        userId: 1,
        userInfo: {
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
          role: 'customer' as const,
        },
      };

      userRepositoryMock.getByEmail.mockResolvedValue(userInfo);

      const userFound = await userService.getByEmail(
        'maquinabeloz@tute.italia',
      );

      expect(userRepositoryMock.getByEmail).toHaveBeenCalledWith(
        'maquinabeloz@tute.italia',
      );

      expect(userFound).toEqual<CustomerExtended>(userInfo);

      expect(userFound.userInfo.role).toEqual('customer');

      expect(userFound).not.toHaveProperty<User>('password');
      expect(userFound).not.toHaveProperty<User>('refreshToken');
    });

    it('should return the SHOP with the specified Email', async () => {
      const userInfo: ShopExtended = {
        userId: 1,
        addressId: 1,
        addressInfo: {
          number: 69,
          street: 'Virgulini',
          neighborhood: 'Francesco',
          city: 'City Test',
          state: 'Tute',
          country: 'Italia',
        },
        userInfo: {
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
          role: 'shop' as const,
        },
      };

      userRepositoryMock.getByEmail.mockResolvedValue(userInfo);

      const userFound = await userService.getByEmail(
        'maquinabeloz@tute.italia',
      );

      expect(userRepositoryMock.getByEmail).toHaveBeenCalledWith(
        'maquinabeloz@tute.italia',
      );

      expect(userFound).toEqual<ShopExtended>(userInfo);

      expect(userFound.userInfo.role).toEqual('shop');

      expect(userFound).not.toHaveProperty<User>('password');
      expect(userFound).not.toHaveProperty<User>('refreshToken');
    });

    it('should throw a error if no user found', async () => {
      userRepositoryMock.getByEmail.mockResolvedValue(undefined);

      await expect(
        userService.getByEmail('maquinabeloz@tute.italia'),
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe('Login User', () => {
    it('should login the user with the specified Email and Password', async () => {
      const userFound: CustomerExtended = {
        userId: 1,
        userInfo: {
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
          role: 'customer' as const,
        },
      };

      userRepositoryMock.getByEmail.mockResolvedValue(userFound);
      bcryptMock.compare.mockResolvedValue(true);
      userRepositoryMock.updateRefreshToken.mockResolvedValue(1);

      const userLoginRes = await userService.logIn(
        'maquinabeloz@tute.italia',
        'supersafepasswordnobodywillnowhihi123',
      );

      expect(userRepositoryMock.getByEmail).toHaveBeenCalledWith(
        'maquinabeloz@tute.italia',
      );

      expect(bcryptMock.compare).toHaveBeenCalledWith(
        'supersafepasswordnobodywillnowhihi123',
        'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
      );

      expect(jwtMock.sign).toHaveBeenCalledWith(
        { role: userFound.userInfo.role },
        process.env.ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: '10m', subject: String(userFound.userInfo.id) },
      );

      expect(jwtMock.sign).toHaveBeenCalledWith(
        { role: userFound.userInfo.role },
        process.env.REFRESH_TOKEN_SECRET as Secret,
        { expiresIn: '20m', subject: String(userFound.userInfo.id) },
      );

      expect(userLoginRes.userInfo).not.toHaveProperty('password');
      expect(userLoginRes.userInfo).not.toHaveProperty('refreshToken');
    });

    it('should throw a error if no user found with the provided credentials', async () => {
      userRepositoryMock.getByEmail.mockResolvedValue(undefined);

      await expect(
        userService.logIn(
          'maquinabeloz@tute.italia',
          'supersafepasswordnobodywillnowhihi123',
        ),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw a error if user found credentials not match the provided credentials', async () => {
      const userFound: CustomerExtended = {
        userId: 1,
        userInfo: {
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
          role: 'customer' as const,
        },
      };

      userRepositoryMock.getByEmail.mockResolvedValue(userFound);
      bcryptMock.compare.mockResolvedValue(false);

      await expect(
        userService.logIn(
          'maquinabeloz@tute.italia',
          'supersafepasswordnobodywillnowhihi123',
        ),
      ).rejects.toThrowError(UnauthorizedError);

      expect(bcryptMock.compare).toHaveBeenCalledWith(
        'supersafepasswordnobodywillnowhihi123',
        'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
      );
    });

    it('should throw a error if database fails to update user refreshToken', async () => {
      const userFound: CustomerExtended = {
        userId: 1,
        userInfo: {
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
          role: 'customer' as const,
        },
      };

      userRepositoryMock.getByEmail.mockResolvedValue(userFound);
      bcryptMock.compare.mockResolvedValue(true);
      userRepositoryMock.updateRefreshToken.mockResolvedValue(0);
      // Retun Value pois o jwt não é await (não retorna promise)
      jwtMock.sign.mockReturnValue('supersafeandencryptedrefreshtoken');

      await expect(
        userService.logIn(
          'maquinabeloz@tute.italia',
          'supersafepasswordnobodywillnowhihi123',
        ),
      ).rejects.toThrowError(InternalServerError);

      expect(bcryptMock.compare).toHaveBeenCalledWith(
        'supersafepasswordnobodywillnowhihi123',
        'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
      );

      expect(userRepositoryMock.updateRefreshToken).toHaveBeenCalledWith({
        ...userFound.userInfo,
        refreshToken: 'supersafeandencryptedrefreshtoken',
      });
    });
  });

  describe('Update Access Token', () => {
    it('should return updated user Access Token', async () => {
      userRepositoryMock.getRefreshToken.mockResolvedValue(
        'supersafeandencryptedrefreshtoken',
      );
      jwtMock.decode.mockReturnValue({
        iat: 1694021780,
        exp: 1794022259,
        sub: '1',
      });
      jwtMock.sign.mockReturnValue('supersafeandencryptedaccesstoken');

      const res = await userService.updateAccessToken(1);

      expect(jwtMock.sign).toHaveBeenCalledWith(
        {},
        process.env.ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: '1m', subject: String(1) },
      );

      expect(res).toEqual('supersafeandencryptedaccesstoken');
    });

    it('should return false if user Refresh Token has expired', async () => {
      userRepositoryMock.getRefreshToken.mockResolvedValue(
        'supersafeandencryptedrefreshtoken',
      );
      jwtMock.decode.mockReturnValue({
        iat: 1694021780,
        exp: 1494022259,
        sub: '1',
      });

      await expect(userService.updateAccessToken(1)).rejects.toThrowError(
        UnauthorizedError,
      );
    });
  });

  describe('Update User', () => {
    const newUserInfo = {
      id: 1,
      name: 'Leoncio',
      email: 'bolinea@gorfe.italia',
    };

    const userInfoUpdated: User = {
      id: 1,
      name: 'Leoncio',
      email: 'bolinea@gorfe.italia',
      password: 'supersafepasswordnobodywillnowhihi123',
      role: 'customer' as const,
      phoneNumber: null,
      refreshToken: 'supersafeandencryptedrefreshtoken',
    };

    it('should return the updated user', async () => {
      userRepositoryMock.existsById.mockResolvedValue(true);
      userRepositoryMock.update.mockResolvedValue(userInfoUpdated);

      const updatedUser = await userService.update(newUserInfo);

      expect(userRepositoryMock.existsById).toHaveBeenCalledWith(
        newUserInfo.id,
      );
      expect(userRepositoryMock.update).toHaveBeenCalledWith(newUserInfo);

      // TODO Checar se updatedAt é maior que createdAt
      expect(updatedUser).toHaveProperty<User>('id');
      expect(updatedUser).not.toHaveProperty<User>('password');
      expect(updatedUser).not.toHaveProperty<User>('refreshToken');
    });

    it('should throw a error if no user found', async () => {
      userRepositoryMock.existsById.mockResolvedValue(false);

      await expect(userService.update(newUserInfo)).rejects.toThrowError(
        NotFoundError,
      );

      expect(userRepositoryMock.existsById).toHaveBeenCalledWith(
        newUserInfo.id,
      );
      expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });
  });
});
