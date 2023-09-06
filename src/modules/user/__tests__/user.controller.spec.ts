/**
 * @jest-environment ./../../../database/drizzle.environment.jest
 */

import app from '../../../app';
import request from 'supertest';

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o migrate demora muito (meu pc é ruim disgurpa)
jest.setTimeout(10000);

describe('User Controller Integration', () => {
  describe('POST /user/create', () => {
    it('should create a new user', async () => {
      const userInfo = {
        name: 'Francesco Virgulini',
        email: 'maquinabeloz@tute.italia',
        password: 'supersafepasswordnobodywillnowhihi123',
        role: 'client' as const,
      };

      const response = await request(app).post('/user/create').send(userInfo);

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveProperty('id');
    });
  });
});
