/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import app from '../../../app';
import request from 'supertest';
import { type ShopCreateType } from '../../shop/shop.schema';
import path from 'path';
import dotenv from 'dotenv';
import { type ScheduleSetType } from '../schedule.schema';
import { type ShopSchedule } from '../../../../database/schema';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o migrate demora muito (meu pc é ruim disgurpa)
jest.setTimeout(10000);

beforeAll(async () => {
  // Pré criando informações necessárias para
  // o schedule ser possível
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

  await request(app)
    .post('/shop/create')
    .send(newShopInfo)
    .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
    .set('x-api-key', `${process.env.API_KEY}`);
});

describe('Schedule Controller Integration', () => {
  describe('POST /schedule/set', () => {
    it('should create a schedule', async () => {
      const newSchedule: ScheduleSetType = [
        {
          shop_id: 1,
          day: 0,
          opening: 8,
          closing: 12,
        },
        {
          shop_id: 1,
          day: 1,
          opening: 8,
          closing: 22,
        },
        {
          shop_id: 1,
          day: 2,
          opening: 8,
          closing: 22,
        },
        {
          shop_id: 1,
          day: 3,
          opening: 8,
          closing: 22,
        },
        {
          shop_id: 1,
          day: 4,
          opening: 8,
          closing: 22,
        },
        {
          shop_id: 1,
          day: 5,
          opening: 8,
          closing: 22,
        },
        {
          shop_id: 1,
          day: 6,
          opening: 8,
          closing: 12,
        },
      ];

      const response = await request(app)
        .post('/schedule/set')
        .send(newSchedule)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toBeInstanceOf(Array);

      response.body.forEach((schedule: ShopSchedule) => {
        expect(schedule).toHaveProperty('shop_id');
      });
    });
  });
});
