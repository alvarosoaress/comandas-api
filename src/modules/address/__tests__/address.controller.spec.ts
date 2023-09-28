/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import app from '../../../app';
import request from 'supertest';
import { type AddressUpdateType } from '../address.schema';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o migrate demora muito (meu pc é ruim disgurpa)
jest.setTimeout(10000);

describe('Address Controller Integration', () => {
  describe('POST /address/create', () => {
    it('should create a new address', async () => {
      const addressInfo = {
        number: 71,
        street: 'Virgulini',
        neighborhood: 'Francesco',
        city: 'City Test',
        state: 'Tute',
        country: 'Italia',
      };

      const response = await request(app)
        .post('/address/create')
        .send(addressInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveProperty('id');
    });
  });

  describe('GET /address/list', () => {
    it('should return a list of addresses', async () => {
      const addressList = [
        {
          number: 71,
          street: 'Virgulini',
          neighborhood: 'Francesco',
          city: 'City Test',
          state: 'Tute',
          country: 'Italia',
          id: expect.any(Number),
          zipcode: null,
          lat: null,
          long: null,
          createdAt: expect.any(String),
        },
      ];

      const response = await request(app)
        .get('/address/list')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body.data).toBeInstanceOf(Array);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);

      expect(response.body.data).toMatchObject(addressList);
    });
  });

  describe('GET /address/:id', () => {
    it('should return a address with the specified id', async () => {
      const response = await request(app)
        .get('/address/1')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveProperty('id');
    });
  });

  describe('PUT /address/update', () => {
    it('should return the updated address', async () => {
      const newAddressInfo: AddressUpdateType = {
        id: 1,
        city: 'Murango',
        neighborhood: 'Bolo',
      };

      const updatedAddress = {
        id: 1,
        number: 71,
        street: 'Virgulini',
        neighborhood: 'Bolo',
        city: 'Murango',
        state: 'Tute',
        country: 'Italia',
        zipcode: null,
        lat: null,
        long: null,
        createdAt: expect.any(String),
      };

      const response = await request(app)
        .put('/address/update')
        .send(newAddressInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body.data.id).toEqual(1);

      expect(response.body.data).toMatchObject(updatedAddress);
    });
  });
});
