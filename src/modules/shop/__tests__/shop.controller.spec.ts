/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import {
  type QrCode,
  type Item,
  type ItemCategory,
} from '../../../../database/schema';
import app from '../../../app';
import request from 'supertest';
import { type ItemCreateType } from '../../item/item.schema';
import { type ShopUpdateType, type ShopCreateType } from '../shop.schema';
import path from 'path';
import dotenv from 'dotenv';
import { type QrCodeCreateType } from '../../qrCode/qrCode.schema';
import { type ItemCategoryCreateType } from '../../itemCategory/itemCategory.schema';

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
      const itemList: Item[] = [
        {
          id: 1,
          name: 'Bolinea de Gorfwe',
          price: 6.99,
          shopId: 1,
          categoryId: null,
          createdAt: expect.any(String),
          description: null,
          temperature: null,
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
            'https://image-charts.com/chart?chs=350x350&cht=qr&choe=UTF-8&icqrf=F3484F&chld=M&chof=.png&chl={shopId:1,table:1}',
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
