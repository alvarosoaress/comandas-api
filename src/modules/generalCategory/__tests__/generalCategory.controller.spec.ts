/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import app from '../../../app';
import request from 'supertest';
import {
  type GeneralCategoryUpdateType,
  type GeneralCategoryCreateType,
  type GeneralCategorySetType,
} from '../generalCategory.schema';
import { type GeneralCategory } from '../../../../database/schema';
import { type ShopCreateType } from '../../shop/shop.schema';

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o migrate demora muito (meu pc é ruim disgurpa)
jest.setTimeout(10000);

describe('General Category Controller Integration', () => {
  describe('POST /generalcategory/create', () => {
    it('should create a general category', async () => {
      const newGeneralCategoryInfo: GeneralCategoryCreateType = {
        name: 'Bolinea de Gorfwe',
      };

      const response = await request(app)
        .post('/generalcategory/create')
        .send(newGeneralCategoryInfo);

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveProperty('id');
    });
  });

  describe('GET /generalcategory/list', () => {
    it('should return a list of general categories', async () => {
      const generalCategoryList: GeneralCategory[] = [
        {
          id: 1,
          name: 'Bolinea de Gorfwe',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ];

      const response = await request(app).get('/generalcategory/list');

      expect(response.status).toBe(200);

      expect(response.body.data).toBeInstanceOf(Array);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);

      expect(response.body.data).toMatchObject(generalCategoryList);
    });
  });

  describe('GET /generalcategory/:id', () => {
    it('should return a general category with the specified ID', async () => {
      const generalCategoryFound: GeneralCategory = {
        id: 1,
        name: 'Bolinea de Gorfwe',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      };

      const response = await request(app).get('/generalcategory/1');

      expect(response.status).toBe(200);

      expect(response.body.data.id).toEqual(1);

      expect(response.body.data).toMatchObject(generalCategoryFound);
    });
  });

  describe('PUT /generalcategory/update', () => {
    it('should return a Updated general category', async () => {
      const newGeneralCategoryInfo: GeneralCategoryUpdateType = {
        name: 'Isekai',
        id: 1,
      };

      const generalCategoryUpdated: GeneralCategory = {
        name: 'Isekai',
        id: 1,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      };

      const response = await request(app)
        .put('/generalcategory/update')
        .send(newGeneralCategoryInfo);

      expect(response.status).toBe(200);

      expect(response.body.data.id).toEqual(1);

      expect(response.body.data).toMatchObject(generalCategoryUpdated);
    });
  });

  describe('POST /generalcategory/set', () => {
    beforeAll(async () => {
      // Pré criando informações necessárias para
      // o Set poder funcionar corretamente
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

      await request(app).post('/shop/create').send(info);
    });
    it('should return a array with the info about the new category assign', async () => {
      const generalCategorySet: GeneralCategorySetType = {
        shopId: 1,
        generalCategoryId: [1],
      };

      const generalCategorySetRes = [{ name: 'Isekai', id: 1 }];

      const response = await request(app)
        .post('/generalcategory/set')
        .send(generalCategorySet);

      console.log(response.body);
      expect(response.status).toBe(200);

      expect(response.body.data).toBeInstanceOf(Array);

      expect(response.body.data).toMatchObject(generalCategorySetRes);
    });
  });

  describe('DELETE /generalcategory/delete/:id', () => {
    it('should return the deleted general category', async () => {
      const generalCategoryUpdated: GeneralCategory = {
        name: 'Isekai',
        id: 1,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      };

      const response = await request(app).delete('/generalcategory/delete/1');

      expect(response.status).toBe(200);

      expect(response.body.data.id).toEqual(1);

      expect(response.body.data).toMatchObject(generalCategoryUpdated);
    });
  });
});
