/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import app from '../../../app';
import request from 'supertest';
import { type ItemCreateType } from '../item.schema';
import { type Item } from '../../../../database/schema';
import { type ShopCreateType } from '../../shop/shop.schema';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o migrate demora muito (meu pc é ruim disgurpa)
jest.setTimeout(10000);

beforeAll(async () => {
  // Pré criando informações necessárias para
  // o item poder existir
  const info: ShopCreateType = {
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

  await request(app)
    .post('/shop/create')
    .send(info)
    .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
    .set('x-api-key', `${process.env.API_KEY}`);
});

describe('Item Controller Integration', () => {
  describe('POST /item/create', () => {
    it('should create a item', async () => {
      const newItemInfo: ItemCreateType = {
        shopId: 1,
        name: 'Bolinea de Gorfwe',
        price: 6.99,
      };

      const response = await request(app)
        .post('/item/create')
        .send(newItemInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');
    });
  });

  describe('GET /item/list', () => {
    it('should return a list of items', async () => {
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
        .get('/item/list')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toBeInstanceOf(Array);

      expect(response.body.length).toBeGreaterThanOrEqual(1);

      expect(response.body).toMatchObject(itemList);
    });
  });

  describe('GET /item/:id', () => {
    it('should return a item with the specified ID', async () => {
      const itemFound: Item = {
        id: 1,
        name: 'Bolinea de Gorfwe',
        price: 6.99,
        shopId: 1,
        categoryId: null,
        createdAt: expect.any(String),
        description: null,
        temperature: null,
      };

      const response = await request(app)
        .get('/item/1')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body.id).toEqual(1);

      expect(response.body).toMatchObject(itemFound);
    });
  });

  describe('PUT /item/update', () => {
    it('should return a Updated Item', async () => {
      const itemUpdated: Item = {
        id: 1,
        name: 'Bolo de murango',
        price: 69.99,
        shopId: 1,
        temperature: 'cold',
      };

      const response = await request(app)
        .put('/item/update')
        .send(itemUpdated)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body.id).toEqual(1);

      expect(response.body).toMatchObject(itemUpdated);
    });
  });

  describe('DELETE /item/delete/:id', () => {
    it('should return the deleted item', async () => {
      const response = await request(app)
        .delete('/item/delete/1')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');

      expect(response.body.id).toEqual(1);
    });
  });
});
