/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import app from '../../../app';
import request from 'supertest';
import { type createAddressType } from '../../address/address.schema';
import { type createUserType } from '../../user/user.schema';
import { type createItemType } from '../item.schema';
import { type Item } from '../../../../database/schema';

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o migrate demora muito (meu pc é ruim disgurpa)
jest.setTimeout(10000);

beforeAll(async () => {
  // Pré criando informações necessárias para
  // o item poder existir
  const userInfo: createUserType = {
    name: 'Francesco Virgulini',
    email: 'maquinabeloz@tute.italia',
    password: 'supersafepasswordnobodywillnowhihi123',
  };
  const addressInfo: createAddressType = {
    number: 69,
    street: 'Virgulini',
    neighborhood: 'Francesco',
    city: 'City Test',
    state: 'Tute',
    country: 'Italia',
  };

  await request(app).post('/shop/create').send({ userInfo, addressInfo });
});

describe('Item Controller Integration', () => {
  describe('POST /item/create', () => {
    it('should create a item', async () => {
      const newItemInfo: createItemType = {
        shopId: 1,
        name: 'Bolinea de Gorfwe',
        price: 6.99,
      };

      const response = await request(app)
        .post('/item/create')
        .send(newItemInfo);

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveProperty('id');
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

      const response = await request(app).get('/item/list');

      expect(response.status).toBe(200);

      expect(response.body.data).toBeInstanceOf(Array);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);

      expect(response.body.data).toMatchObject(itemList);
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

      const response = await request(app).get('/item/1');

      expect(response.status).toBe(200);

      expect(response.body.data.id).toEqual(1);

      expect(response.body.data).toMatchObject(itemFound);
    });
  });

  describe('POST /item/update', () => {
    it('should return a Updated Item', async () => {
      const itemUpdated: Item = {
        id: 1,
        name: 'Bolo de murango',
        price: 69.99,
        shopId: 1,
        temperature: 'cold',
      };

      const response = await request(app)
        .post('/item/update')
        .send(itemUpdated);

      console.log(response.body);

      expect(response.status).toBe(200);

      expect(response.body.data.id).toEqual(1);

      expect(response.body.data).toMatchObject(itemUpdated);
    });
  });
});
