/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import app from '../../../app';
import request from 'supertest';
import { type ShopCreateType } from '../../shop/shop.schema';
import path from 'path';
import dotenv from 'dotenv';
import { type ItemCreateType } from '../../item/item.schema';
import { type CustomerCreateType } from '../../customer/customer.schema';
import { type QrCodeCreateType } from '../../qrCode/qrCode.schema';
import { type OrderCreateType } from '../order.schema';
import { type Order } from '../../../../database/schema';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o migrate demora muito (meu pc é ruim disgurpa)
jest.setTimeout(10000);

beforeAll(async () => {
  // Pré criando informações necessárias para
  // a order ser possível
  const newShopInfo: ShopCreateType = {
    shopInfo: {
      tables: 5,
    },
    userInfo: {
      name: 'Francesco Virgulini',
      email: 'maquinabeloz@tute.italia',
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

  const newCustomer: CustomerCreateType = {
    userInfo: {
      name: 'Virgulini',
      email: 'maquina@tute.italia',
      password: 'supersafepasswordnobodywillnowhihi123',
    },
  };

  const newItem: ItemCreateType = {
    name: 'Bolo de murango',
    price: 71.8,
    shopId: 1,
  };

  const newQrCodeInfo: QrCodeCreateType = {
    shopId: 1,
    table: 1,
  };

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
    .post('/customer/create')
    .send(newCustomer)
    .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
    .set('x-api-key', `${process.env.API_KEY}`);

  await request(app)
    .post('/qrcode/create')
    .send(newQrCodeInfo)
    .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
    .set('x-api-key', `${process.env.API_KEY}`);
});

describe('Order Controller Integration', () => {
  describe('POST /order/create', () => {
    it('should create a order', async () => {
      const newOrderInfo: OrderCreateType = [
        {
          customerId: 2,
          shopId: 1,
          itemId: 1,
          quantity: 1,
          tableId: 1,
          total: 457.78,
          note: 'No slow romcom please',
        },
      ];

      const response = await request(app)
        .post('/order/create')
        .send(newOrderInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('groupId');
    });
  });

  describe('GET /order/list', () => {
    it('should return all orders', async () => {
      const response = await request(app)
        .get('/order/list')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      response.body.forEach((order: Order) => {
        expect(order).toHaveProperty('id');
        expect(order).toHaveProperty('groupId');
      });
    });
  });

  describe('GET /order/:groupId', () => {
    it('should return order with specified group id', async () => {
      // Necessário o GET primeio pois o groupId é random
      const order = await request(app)
        .get('/order/list')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      const response = await request(app)
        .get(`/order/${order.body[0].groupId}`)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('groupId');
    });
  });

  describe('POST /order/complete/:groupId', () => {
    it('should return order with specified group id', async () => {
      // Necessário o GET primeio pois o groupId é random
      const order = await request(app)
        .get('/order/list')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      const response = await request(app)
        .post(`/order/complete/${order.body[0].groupId}`)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('groupId');
    });
  });

  describe('DELETE /order/cancel/:groupId', () => {
    it('should return order with specified group id', async () => {
      // Necessário o GET primeio pois o groupId é random
      const order = await request(app)
        .get('/order/list')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      const response = await request(app)
        .delete(`/order/cancel/${order.body[0].groupId}`)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('groupId');
    });
  });
});
