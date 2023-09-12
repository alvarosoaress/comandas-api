/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import { type ShopSafe } from '../../../../database/schema';
import app from '../../../app';
import request from 'supertest';
import { type createUserType } from '../../user/user.schema';
import { type createAddressType } from '../../address/address.schema';

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o migrate demora muito (meu pc é ruim disgurpa)
jest.setTimeout(10000);

beforeAll(async () => {
  // Pré criando informações necessárias para
  // o shop poder existir
  const userInfo: createUserType = {
    name: 'Francesco Virgulini',
    email: 'maquinabeloz@tute.italia',
    password: 'supersafepasswordnobodywillnowhihi123',
    role: 'client' as const,
  };
  const addressInfo: createAddressType = {
    number: 69,
    street: 'Virgulini',
    neighborhood: 'Francesco',
    city: 'City Test',
    state: 'Tute',
    country: 'Italia',
  };

  await request(app).post('/user/create').send(userInfo);
  await request(app).post('/address/create').send(addressInfo);
});

describe('Shop Controller Integration', () => {
  describe('POST /shop/create', () => {
    it('should create a shop', async () => {
      const newShopInfo = {
        addressId: 1,
        userId: 1,
      };

      const response = await request(app)
        .post('/shop/create')
        .send(newShopInfo);

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.role).toEqual('shop');
    });
  });

  describe('GET /shop/list', () => {
    it('should return a list of shops', async () => {
      const shopList: ShopSafe[] = [
        {
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          role: 'shop',
          id: expect.any(Number),
          phoneNumber: null,
          photoUrl: null,
          birthday: null,
          createdAt: expect.any(String),
          address: {
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

      response.body.data.forEach((shop: ShopSafe) => {
        expect(shop.role).toEqual('shop');
        expect(shop).toHaveProperty('address');
      });
    });
  });

  describe('GET /shop/:id', () => {
    it('should return a shop with the specified ID', async () => {
      const response = await request(app).get('/shop/1');

      expect(response.status).toBe(200);

      expect(response.body.data.id).toEqual(1);

      expect(response.body.data).toHaveProperty('address');
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
