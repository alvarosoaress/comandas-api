/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import { type Item, type ShopExtendedSafe } from '../../../../database/schema';
import app from '../../../app';
import request from 'supertest';
import { type ItemCreateType } from '../../item/item.schema';
import { type ShopCreateType } from '../shop.schema';

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
        .send(newShopInfo);

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveProperty('userInfo');
      expect(response.body.data.userInfo.role).toEqual('shop');
    });
  });

  describe('GET /shop/list', () => {
    it('should return a list of shops', async () => {
      const shopList: ShopExtendedSafe[] = [
        {
          userId: 1,
          addressId: 1,
          tables: 5,
          userInfo: {
            name: 'Francesco Virgulini',
            email: 'maquinabeloz@tute.italia',
            role: 'shop',
            id: expect.any(Number),
            phoneNumber: null,
            createdAt: expect.any(String),
          },
          addressInfo: {
            id: 1,
            city: 'City Test',
            neighborhood: 'Francesco',
            number: 69,
            street: 'Virgulini',
            state: 'Tute',
            country: 'Italia',
          },
        },
      ];

      const response = await request(app).get('/shop/list');

      expect(response.status).toBe(200);

      expect(response.body.data).toBeInstanceOf(Array);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);

      expect(response.body.data).toMatchObject(shopList);

      response.body.data.forEach((shop: ShopExtendedSafe) => {
        expect(shop.userInfo.role).toEqual('shop');
      });
    });
  });

  describe('GET /shop/:id/menu', () => {
    beforeAll(async () => {
      const newItemInfo: ItemCreateType = {
        shopId: 1,
        name: 'Bolinea de Gorfwe',
        price: 6.99,
      };

      await request(app).post('/item/create').send(newItemInfo);
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

      const response = await request(app).get('/shop/1/menu');

      expect(response.status).toBe(200);

      expect(response.body.data).toBeInstanceOf(Array);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);

      expect(response.body.data).toMatchObject(itemList);
    });
  });
  // TODO Criar o endPoint de adicionar items para poder testar o getMenu
  //   describe('GET /shop/:id/menu', () => {
  //     it('should return a shop with the specified ID', async () => {
  //       const response = await request(app).get('/shop/1/menu');

  //       expect(response.status).toBe(200);

  //       expect(response.body.data.id).toEqual(1);

  //       expect(response.body.data.items).toBeInstanceOf(Array);

  //       expect(response.body.data.items.length).toEqual(0);
  //     });
  //   });
});
