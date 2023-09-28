/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import app from '../../../app';
import request from 'supertest';
import { type UserCreateType } from '../user.schema';
import { type AddressCreateType } from '../../address/address.schema';
import { type UserSafe } from '../../../../database/schema';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o migrate demora muito (meu pc é ruim disgurpa)
jest.setTimeout(10000);

beforeAll(async () => {
  // Pré criando informações necessárias para
  // um user poder existir
  const userInfo: UserCreateType = {
    name: 'Francesco Virgulini',
    email: 'maquinabeloz@tute.italia',
    password: 'supersafepasswordnobodywillnowhihi123',
  };
  const addressInfo: AddressCreateType = {
    number: 69,
    street: 'Virgulini',
    neighborhood: 'Francesco',
    city: 'City Test',
    state: 'Tute',
    country: 'Italia',
  };

  await request(app)
    .post('/shop/create')
    .send({ userInfo, addressInfo })
    .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
    .set('x-api-key', `${process.env.API_KEY}`);
});

describe('User Controller Integration', () => {
  describe('GET /user/list', () => {
    it('should return a list of users', async () => {
      const userList = [
        {
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          role: 'shop',
          id: expect.any(Number),
          phoneNumber: null,
          createdAt: expect.any(String),
        },
      ];

      const response = await request(app)
        .get('/user/list')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body.data).toBeInstanceOf(Array);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);

      expect(response.body.data).toMatchObject(userList);
    });
  });

  describe('GET /user/:id', () => {
    it('should return a user with the specified ID', async () => {
      const response = await request(app)
        .get('/user/1')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);
      expect(response.body.data.userInfo.id).toEqual(1);
    });
  });

  describe('POST /user/login', () => {
    it('should return userInfo and AccessToken', async () => {
      const userInfo = {
        name: 'Francesco Virgulini',
        email: 'maquinabeloz@tute.italia',
        role: 'shop' as const,
        id: expect.any(Number),
        phoneNumber: null,
        createdAt: expect.any(String),
      };

      const userCredentials = {
        email: 'maquinabeloz@tute.italia',
        password: 'supersafepasswordnobodywillnowhihi123',
      };

      const response = await request(app)
        .post('/user/login')
        .send(userCredentials)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body.data.userInfo).toMatchObject(userInfo);

      expect(response.body.data.accessToken).not.toBeNull();
    });
  });

  describe('PUT /user/updateToken', () => {
    it('should return new AccessToken', async () => {
      const userId = {
        id: 1,
      };

      const response = await request(app)
        .put('/user/updateToken')
        .send(userId)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body.data).not.toBeNull();
    });
  });

  describe('PUT /user/update', () => {
    it('should return the updated user', async () => {
      const newUserInfo = {
        id: 1,
        name: 'Leoncio',
        email: 'bolinea@gorfe.italia',
      };

      const updatedUser: UserSafe = {
        name: 'Leoncio',
        email: 'bolinea@gorfe.italia',
        role: 'shop' as const,
        id: expect.any(Number),
        phoneNumber: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      };

      const response = await request(app)
        .put('/user/update')
        .send(newUserInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body.data).not.toBeNull();

      expect(response.body.data).toMatchObject(updatedUser);

      expect(response.body.data).not.toHaveProperty('password');
      expect(response.body.data).not.toHaveProperty('refreshToken');
    });
  });
});
