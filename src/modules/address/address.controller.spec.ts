/**
 * @jest-environment ./../../../database/drizzle.environment.jest
 */

import app from '../../app';
import request from 'supertest';

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o BD está em uma VM muito fraca
jest.setTimeout(10000);

describe('Address Controller', () => {
  it('should create a new address', async () => {
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
});
