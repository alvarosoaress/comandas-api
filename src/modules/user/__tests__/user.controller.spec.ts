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

  describe('GET /user/list', () => {
    it('should return a list of users', async () => {
      const userList = [
        {
          name: 'Francesco Virgulini',
          email: 'maquinabeloz@tute.italia',
          role: 'client',
          id: expect.any(Number),
          phoneNumber: null,
          photoUrl: null,
          birthday: null,
          createdAt: expect.any(String),
          addressId: null,
        },
      ];

      const response = await request(app).get('/user/list');

      expect(response.status).toBe(200);

      expect(response.body.data).toBeInstanceOf(Array);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);

      expect(response.body.data).toMatchObject(userList);
    });
  });

  describe('GET /user/:id', () => {
    it('should return a user with the specified ID', async () => {
      const response = await request(app).get('/user/1');

      expect(response.status).toBe(200);

      expect(response.body.data.id).toEqual(1);
    });
  });

  describe('POST /user/login', () => {
    it('should and return userInfo and AccessToken', async () => {
      const userInfo = {
        name: 'Francesco Virgulini',
        email: 'maquinabeloz@tute.italia',
        role: 'client' as const,
        id: expect.any(Number),
        phoneNumber: null,
        photoUrl: null,
        birthday: null,
        createdAt: expect.any(String),
        addressId: null,
      };

      const userCredentials = {
        email: 'maquinabeloz@tute.italia',
        password: 'supersafepasswordnobodywillnowhihi123',
      };

      const response = await request(app)
        .post('/user/login')
        .send(userCredentials);

      expect(response.status).toBe(200);

      expect(response.body.data.userInfo).toMatchObject(userInfo);

      expect(response.body.data.accessToken).not.toBeNull();
    });
  });

  describe('POST /user/updateToken', () => {
    it('should and return new AccessToken', async () => {
      const userId = {
        id: 1,
      };

      const response = await request(app)
        .post('/user/updateToken')
        .send(userId);

      expect(response.status).toBe(200);

      expect(response.body.data).not.toBeNull();
    });
  });
});
