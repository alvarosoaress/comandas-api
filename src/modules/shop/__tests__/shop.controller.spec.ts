/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import {
  type QrCode,
  type ItemCategory,
  type OrderFormatted,
  type ShopSchedule,
  type ItemMenu,
  type Review,
} from '../../../../database/schema';
import app from '../../../app';
import request from 'supertest';
import { type ItemCreateType } from '../../item/item.schema';
import { type ShopUpdateType, type ShopCreateType } from '../shop.schema';
import path from 'path';
import dotenv from 'dotenv';
import { type QrCodeCreateType } from '../../qrCode/qrCode.schema';
import { type ItemCategoryCreateType } from '../../itemCategory/itemCategory.schema';
import { type OrderCreateType } from '../../order/order.schema';
import { type CustomerCreateType } from '../../customer/customer.schema';
import { type ScheduleSetType } from '../../schedule/schedule.schema';
import { type ReviewCreateType } from '../../review/review.schema';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o migrate demora muito (meu pc é ruim disgurpa)
jest.setTimeout(10000);

describe('Shop Controller Integration', () => {
  describe('POST /shop/create', () => {
    it('should create a shop', async () => {
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

      const response = await request(app)
        .post('/shop/create')
        .send(newShopInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('userInfo');
      expect(response.body.userInfo.role).toEqual('shop');
    });
  });

  describe('GET /shop/:id/menu', () => {
    beforeAll(async () => {
      const newItemInfo: ItemCreateType = {
        shopId: 1,
        name: 'Bolinea de Gorfwe',
        price: 6.99,
      };

      await request(app)
        .post('/item/create')
        .send(newItemInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);
    });

    it('should return the menu of the shop with the specified ID', async () => {
      const itemList: ItemMenu[] = [
        {
          id: 1,
          name: 'Bolinea de Gorfwe',
          price: 6.99,
          shopId: 1,
          description: null,
          temperature: null,
          photoUrl: null,
          category: expect.any(Object),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ];

      const response = await request(app)
        .get('/shop/1/menu')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toBeInstanceOf(Array);

      expect(response.body.length).toBeGreaterThanOrEqual(1);

      expect(response.body).toMatchObject(itemList);
    });
  });

  describe('GET /shop/:id/qrcode', () => {
    beforeAll(async () => {
      const newQrCode: QrCodeCreateType = {
        shopId: 1,
        table: 1,
      };

      await request(app)
        .post('/qrcode/create')
        .send(newQrCode)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);
    });

    it('should return all the qrCodes belonging to shop', async () => {
      const qrCodes: QrCode[] = [
        {
          qrCodeUrl:
            'https://image-charts.com/chart?chs=350x350&cht=qr&choe=UTF-8&icqrf=F3484F&chld=M&chof=.png&chl={"shopId":1,"table":1}',
          shopId: 1,
          table: 1,
          id: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          isOccupied: false,
        },
      ];

      const response = await request(app)
        .get('/shop/1/qrcode')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toBeInstanceOf(Array);

      expect(response.body.length).toBeGreaterThanOrEqual(1);

      expect(response.body).toMatchObject(qrCodes);
    });
  });

  describe('GET /shop/:id/order', () => {
    beforeAll(async () => {
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

      const newOrder: OrderCreateType = [
        {
          shopId: 1,
          customerId: 2,
          itemId: 1,
          quantity: 1,
          tableId: 1,
          total: 258.78,
        },
      ];

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
        .post('/order/create')
        .send(newOrder)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);
    });

    it('should return all the orders belonging to shop', async () => {
      const orders: OrderFormatted[] = [
        {
          shop: {
            userId: 1,
            addressId: 1,
            tables: 5,
            photoUrl: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            userInfo: {
              id: 1,
              name: 'Francesco Virgulini',
              email: 'maquinabeloz@tute.italia',
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
            userId: 2,
            photoUrl: null,
            birthday: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            userInfo: {
              id: 2,
              name: 'Virgulini',
              email: 'maquina@tute.italia',
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
              name: 'Bolinea de Gorfwe',
              shopId: 1,
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
        .get('/shop/1/order')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toBeInstanceOf(Array);

      expect(response.body.length).toBeGreaterThanOrEqual(1);

      expect(response.body).toMatchObject(orders);
    });
  });

  describe('GET /shop/:id/schedule', () => {
    beforeAll(async () => {
      const newSchedule: ScheduleSetType = [
        {
          shop_id: 1,
          day: 0,
          opening: 8,
          closing: 12,
        },
        {
          shop_id: 1,
          day: 1,
          opening: 8,
          closing: 22,
        },
        {
          shop_id: 1,
          day: 2,
          opening: 8,
          closing: 22,
        },
        {
          shop_id: 1,
          day: 3,
          opening: 8,
          closing: 22,
        },
        {
          shop_id: 1,
          day: 4,
          opening: 8,
          closing: 22,
        },
        {
          shop_id: 1,
          day: 5,
          opening: 8,
          closing: 22,
        },
        {
          shop_id: 1,
          day: 6,
          opening: 8,
          closing: 12,
        },
      ];

      await request(app)
        .post('/schedule/set')
        .send(newSchedule)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);
    });

    it('should return the shop schedule', async () => {
      const schedule: ShopSchedule[] = [
        {
          shop_id: 1,
          day: 0,
          opening: 8,
          closing: 12,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          shop_id: 1,
          day: 1,
          opening: 8,
          closing: 22,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          shop_id: 1,
          day: 2,
          opening: 8,
          closing: 22,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          shop_id: 1,
          day: 3,
          opening: 8,
          closing: 22,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          shop_id: 1,
          day: 4,
          opening: 8,
          closing: 22,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          shop_id: 1,
          day: 5,
          opening: 8,
          closing: 22,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          shop_id: 1,
          day: 6,
          opening: 8,
          closing: 12,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ];

      const response = await request(app)
        .get('/shop/1/schedule')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toBeInstanceOf(Array);

      expect(response.body.length).toBeGreaterThanOrEqual(1);

      expect(response.body).toMatchObject(schedule);
    });
  });

  describe('GET /shop/:id/itemcategory', () => {
    beforeAll(async () => {
      const newItemCategory: ItemCategoryCreateType = {
        shopId: 1,
        name: 'Cold drinks',
      };

      await request(app)
        .post('/itemcategory/create')
        .send(newItemCategory)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);
    });

    it('should return all the item categories belonging to shop', async () => {
      const itemCategories: ItemCategory[] = [
        {
          shopId: 1,
          id: 1,
          name: 'Cold drinks',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ];

      const response = await request(app)
        .get('/shop/1/itemcategory')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toBeInstanceOf(Array);

      expect(response.body.length).toBeGreaterThanOrEqual(1);

      expect(response.body).toMatchObject(itemCategories);
    });
  });

  describe('GET /shop/:id/review', () => {
    beforeAll(async () => {
      const newReview: ReviewCreateType = {
        shopId: 1,
        customerId: 2,
        rating: 4.58,
        comment: 'Ok',
      };

      await request(app)
        .post('/review/create')
        .send(newReview)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);
    });

    it('should return all reviews belonging to shop', async () => {
      const shopReviews: Review[] = [
        {
          shopId: 1,
          customerId: 2,
          id: 1,
          rating: 4.58,
          comment: 'Ok',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ];

      const response = await request(app)
        .get('/shop/1/review')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toBeInstanceOf(Array);

      expect(response.body.length).toBeGreaterThanOrEqual(1);

      expect(response.body).toMatchObject(shopReviews);
    });
  });

  describe('PUT /shop/update', () => {
    it('should return the updated shop', async () => {
      const newShopInfo: ShopUpdateType = {
        userId: 1,
        tables: 85,
      };

      const response = await request(app)
        .put('/shop/update')
        .send(newShopInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('updatedAt');

      expect(response.body.userId).toEqual(1);
    });
  });
});
