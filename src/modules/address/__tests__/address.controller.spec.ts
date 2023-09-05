/**
 * @jest-environment ./../../../database/drizzle.environment.jest
 */

import app from '../../../app';
import request from 'supertest';

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o migrate demora muito (meu pc é ruim disgurpa)
jest.setTimeout(10000);

describe('Address Controller Integration', () => {
  it('POST /address/create -> should create a new address', async () => {
    const addressInfo = {
      number: 69,
      street: 'Virgulini',
      neighborhood: 'Franceso',
      city: 'City Test',
      state: 'Tute',
      country: 'Italia',
    };

    const response = await request(app)
      .post('/address/create')
      .send(addressInfo);

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveProperty('id');
  });

  it('GET /address/list -> should return a list of addresses', async () => {
    const addressList = [
      {
        number: 69,
        street: 'Virgulini',
        neighborhood: 'Franceso',
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

    const response = await request(app).get('/address/list');

    expect(response.status).toBe(200);

    expect(response.body.data).toBeInstanceOf(Array);

    expect(response.body.data.length).toBeGreaterThanOrEqual(1);

    expect(response.body.data).toMatchObject(addressList);
  });

  it('POST /address/:id -> should return a address with the specified id', async () => {
    const response = await request(app).get('/address/1');

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveProperty('id');
  });
});
