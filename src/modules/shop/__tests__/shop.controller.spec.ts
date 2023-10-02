/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import { type Item } from '../../../../database/schema';
import app from '../../../app';
import request from 'supertest';
import { type ItemCreateType } from '../../item/item.schema';
import { type ShopUpdateType, type ShopCreateType } from '../shop.schema';
import path from 'path';
import dotenv from 'dotenv';

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
