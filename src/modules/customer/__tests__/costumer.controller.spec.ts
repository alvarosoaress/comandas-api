/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import {
  type OrderFormatted,
  type CustomerExtendedSafe,
} from '../../../../database/schema';
import app from '../../../app';
import request from 'supertest';
import {
  type CustomerUpdateType,
  type CustomerCreateType,
} from '../customer.schema';
import path from 'path';
import dotenv from 'dotenv';
import { type ItemCreateType } from '../../item/item.schema';
import { type OrderCreateType } from '../../order/order.schema';
import { type ShopCreateType } from '../../shop/shop.schema';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

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
        .send(newCustomerInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('userInfo');
      expect(response.body).toHaveProperty('userId');
      expect(response.body.userInfo.role).toEqual('customer');
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

      const response = await request(app)
        .get('/customer/list')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toBeInstanceOf(Array);

      expect(response.body.length).toBeGreaterThanOrEqual(1);

      expect(response.body).toMatchObject(customerList);

      response.body.forEach((customer: CustomerExtendedSafe) => {
        expect(customer.userInfo.role).toEqual('customer');
      });
    });
  });

  describe('GET /customer/:id/order', () => {
    beforeAll(async () => {
      const newShopInfo: ShopCreateType = {
        shopInfo: {
          tables: 5,
        },
        userInfo: {
          name: 'Leoncio',
          email: 'leoncio@tute.italia',
          password: 'supersafepasswordnobodywillnowhihi123',
        },
        addressInfo: {
          number: 69,
          street: 'Virgulini',
          neighborhood: 'Francesco',
          city: 'City Test',
          state: 'Tute',
          country: 'Italia',
        },
      };

      const newItem: ItemCreateType = {
        name: 'Bolo de murango',
        price: 71.8,
        shopId: 2,
      };

      const newOrder: OrderCreateType = [
        {
          customerId: 1,
          shopId: 2,
          itemId: 1,
          quantity: 1,
          tableId: 1,
          total: 258.78,
        },
      ];

      await request(app)
        .post('/shop/create')
        .send(newShopInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      await request(app)
        .post('/item/create')
        .send(newItem)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      await request(app)
        .post('/order/create')
        .send(newOrder)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);
    });

    it('should return all the orders belonging to customer', async () => {
      const orders: OrderFormatted[] = [
        {
          shop: {
            userId: 2,
            addressId: 1,
            tables: 5,
            photoUrl: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            userInfo: {
              id: 2,
              name: 'Leoncio',
              email: 'leoncio@tute.italia',
              phoneNumber: null,
              role: 'shop',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            addressInfo: {
              id: 1,
              street: 'Virgulini',
              number: 69,
              neighborhood: 'Francesco',
              city: 'City Test',
              state: 'Tute',
              country: 'Italia',
              zipcode: null,
              lat: null,
              long: null,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
          groupId: expect.any(Number),
          tableId: 1,
          id: 1,
          customer: {
            userId: 1,
            photoUrl: 'https://animesisfun.eww',
            birthday: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            userInfo: {
              id: 1,
              name: 'Francesco Virgulini',
              email: 'maquinabeloz@tute.italia',
              phoneNumber: null,
              role: 'customer',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
          status: 'open',
          items: [
            {
              id: 1,
              name: 'Bolo de murango',
              shopId: 2,
              categoryId: null,
              description: null,
              temperature: null,
              quantity: 1,
              total: 258.78,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          ],
          total: 258.78,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          note: null,
        },
      ];

      const response = await request(app)
        .get('/customer/1/order')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toBeInstanceOf(Array);

      expect(response.body.length).toBeGreaterThanOrEqual(1);

      expect(response.body).toMatchObject(orders);
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
        .send(newCostumerInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('updatedAt');

      expect(response.body.photoUrl).toEqual('https://animeisnotfun.anymore');
    });
  });
});
