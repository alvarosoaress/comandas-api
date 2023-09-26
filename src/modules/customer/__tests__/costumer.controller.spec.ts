/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import { type CustomerExtendedSafe } from '../../../../database/schema';
import app from '../../../app';
import request from 'supertest';
import {
  type CustomerUpdateType,
  type CustomerCreateType,
} from '../customer.schema';

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o migrate demora muito (meu pc é ruim disgurpa)
jest.setTimeout(10000);

describe('Customer Controller Integration', () => {
  describe('POST /customer/create', () => {
    it('should create a customer', async () => {
      const newCustomerInfo: CustomerCreateType = {
        customerInfo: {
          photoUrl: 'https://animesisfun.eww',
        },
        userInfo: {
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          password: 'superencryptedpasswordnobodywillknowthatilikeanimehihi321',
          role: 'customer' as const,
        },
      };

      const response = await request(app)
        .post('/customer/create')
        .send(newCustomerInfo);

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveProperty('userInfo');
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data.userInfo.role).toEqual('customer');
    });
  });

  describe('GET /customer/list', () => {
    it('should return a list of customers', async () => {
      const customerList: CustomerExtendedSafe[] = [
        {
          userId: 1,
          photoUrl: 'https://animesisfun.eww',
          birthday: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          userInfo: {
            name: 'Francesco Virgulini',
            email: 'maquinabeloz@tute.italia',
            role: 'customer',
            id: expect.any(Number),
            phoneNumber: null,
            createdAt: expect.any(String),
          },
        },
      ];

      const response = await request(app).get('/customer/list');

      expect(response.status).toBe(200);

      expect(response.body.data).toBeInstanceOf(Array);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);

      expect(response.body.data).toMatchObject(customerList);

      response.body.data.forEach((customer: CustomerExtendedSafe) => {
        expect(customer.userInfo.role).toEqual('customer');
      });
    });
  });

  describe('PUT /customer/update', () => {
    it('should return a updated customer', async () => {
      const newCostumerInfo: CustomerUpdateType = {
        userId: 1,
        photoUrl: 'https://animeisnotfun.anymore',
      };

      const response = await request(app)
        .put('/customer/update')
        .send(newCostumerInfo);

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveProperty('updatedAt');

      expect(response.body.data.photoUrl).toEqual(
        'https://animeisnotfun.anymore',
      );
    });
  });
});
