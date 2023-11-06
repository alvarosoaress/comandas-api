/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import app from '../../../app';
import request from 'supertest';

import path from 'path';
import dotenv from 'dotenv';
import { type CustomerCreateType } from '../../customer/customer.schema';
import { type ItemCreateType } from '../../item/item.schema';
import { type OrderCreateType } from '../../order/order.schema';
import { type QrCodeCreateType } from '../../qrCode/qrCode.schema';
import { type ShopCreateType } from '../../shop/shop.schema';
import { type ReviewUpdateType, type ReviewCreateType } from '../review.schema';
import { type Review } from '../../../../database/schema';

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

  const newOrder: OrderCreateType = [
    {
      shopId: 1,
      customerId: 2,
      itemId: 1,
      quantity: 1,
      tableId: 1,
      total: 71.8,
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
    .post('/customer/create')
    .send(newCustomer)
    .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
    .set('x-api-key', `${process.env.API_KEY}`);

  await request(app)
    .post('/qrcode/create')
    .send(newQrCodeInfo)
    .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
    .set('x-api-key', `${process.env.API_KEY}`);

  await request(app)
    .post('/order/create')
    .send(newOrder)
    .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
    .set('x-api-key', `${process.env.API_KEY}`);
});

describe('Review Controller Integration', () => {
  describe('POST /review/create', () => {
    it('should create a review', async () => {
      const newReviewInfo: ReviewCreateType = {
        customerId: 2,
        shopId: 1,
        rating: 4.58,
        comment: 'Very good',
      };

      const response = await request(app)
        .post('/review/create')
        .send(newReviewInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      const newShopRating = await request(app)
        .get('/user/1')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);
      expect(newShopRating.status).toBe(200);

      expect(response.body).toHaveProperty('id');
      expect(newShopRating.body.rating).toEqual(newReviewInfo.rating);
    });
  });

  describe('PUT /review/create', () => {
    it('should update a review', async () => {
      const updateReviewInfo: ReviewUpdateType = {
        id: 1,
        rating: 2.12,
        comment: 'Not so good anymore',
      };

      const response = await request(app)
        .put('/review/update')
        .send(updateReviewInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.rating).toEqual(updateReviewInfo.rating);
    });
  });

  describe('DELETE /review/create', () => {
    it('should delete a review', async () => {
      const reviewInfo: Review = {
        id: 1,
        customerId: 2,
        shopId: 1,
        rating: 2.12,
        comment: 'Not so good anymore',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      };

      const response = await request(app)
        .delete('/review/delete/1')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toMatchObject(reviewInfo);
    });
  });
});
