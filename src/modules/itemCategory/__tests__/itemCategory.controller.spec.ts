/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import app from '../../../app';
import request from 'supertest';
import path from 'path';
import dotenv from 'dotenv';
import { type ShopCreateType } from '../../shop/shop.schema';
import { type ItemCreateType } from '../../item/item.schema';
import {
  type ItemCategorySetType,
  type ItemCategoryCreateType,
  type ItemCategoryRemoveType,
} from '../itemCategory.schema';
import { type ItemCategory } from '../../../../database/schema';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o migrate demora muito (meu pc é ruim disgurpa)
jest.setTimeout(10000);

beforeAll(async () => {
  // Pré criando informações necessárias para
  // o item category poder existir
  const shopInfo: ShopCreateType = {
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

  const itemInfo: ItemCreateType = {
    name: 'Bolo de murango',
    price: 7.77,
    shopId: 1,
  };

  await request(app)
    .post('/shop/create')
    .send(shopInfo)
    .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
    .set('x-api-key', `${process.env.API_KEY}`);

  await request(app)
    .post('/item/create')
    .send(itemInfo)
    .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
    .set('x-api-key', `${process.env.API_KEY}`);
});

describe('Item Category Controller Integration', () => {
  describe('POST /itemcategory/create', () => {
    it('shoud create a item category', async () => {
      const itemCategoryInfo: ItemCategoryCreateType = {
        name: 'Romcom',
        shopId: 1,
      };

      const response = await request(app)
        .post('/itemcategory/create')
        .send(itemCategoryInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');
    });
  });

  describe('GET /itemcategory/:id', () => {
    it('should return a item category with the specified id', async () => {
      const itemCategory: ItemCategory = {
        id: 1,
        shopId: 1,
        name: 'Romcom',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      };

      const response = await request(app)
        .get('/itemcategory/1')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');

      expect(response.body.id).toEqual(1);

      expect(response.body).toMatchObject(itemCategory);
    });
  });

  describe('GET /itemcategory/list', () => {
    it('should return all item categories', async () => {
      const itemCategory: ItemCategory[] = [
        {
          id: 1,
          shopId: 1,
          name: 'Romcom',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ];

      const response = await request(app)
        .get('/itemcategory/list')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toBeInstanceOf(Array);

      expect(response.body).toMatchObject(itemCategory);
    });
  });

  describe('POST /itemcategory/set', () => {
    it('shoud set a item category', async () => {
      const itemCategoryInfo: ItemCategorySetType = {
        itemCategoryId: 1,
        itemId: 1,
      };

      const response = await request(app)
        .post('/itemcategory/set')
        .send(itemCategoryInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');
    });
  });

  describe('DELETE /itemcategory/set', () => {
    it('shoud set a item category', async () => {
      const itemCategoryInfo: ItemCategoryRemoveType = {
        itemCategoryId: 1,
        itemId: 1,
      };

      const response = await request(app)
        .delete('/itemcategory/remove')
        .send(itemCategoryInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');
    });
  });
});
