/**
 * @jest-environment ./database/drizzle.environment.jest
 */

import app from '../../../app';
import request from 'supertest';
import path from 'path';
import dotenv from 'dotenv';
import { type ShopCreateType } from '../../shop/shop.schema';
import { type QrCodeCreateType } from '../qrCode.schema';
import { type QrCode } from '../../../../database/schema';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Define o limite de tempo de espera para 10 segundos (10000 ms)
// Necessário, pois o migrate demora muito (meu pc é ruim disgurpa)
jest.setTimeout(10000);

beforeAll(async () => {
  // Pré criando informações necessárias para
  // um shop poder existir
  const newShopInfo: ShopCreateType = {
    shopInfo: {
      tables: 1,
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

describe('QrCode Controller Integration', () => {
  describe('POST /qrcode/create', () => {
    it('should create a new QrCode', async () => {
      const newQrCodeInfo: QrCodeCreateType = {
        shopId: 1,
        table: 1,
      };

      const response = await request(app)
        .post('/qrcode/create')
        .send(newQrCodeInfo)
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      // Esperando resposta 409 pois o shop já terá um qrCode
      // O registro cria um qrCode para cada mesa do shop
      expect(response.status).toBe(409);
    });
  });

  describe('GET /qrcode/:id', () => {
    it('should return the qrCode with the specified id', async () => {
      const response = await request(app)
        .get('/qrcode/1')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');

      expect(response.body.id).toEqual(1);

      expect(response.body.qrCodeUrl).toEqual(
        'https://image-charts.com/chart?chs=350x350&cht=qr&choe=UTF-8&icqrf=F3484F&chld=M&chof=.png&chl={"shopId":1,"table":1}',
      );

      expect(response.body.isOccupied).toBeFalsy();
    });
  });

  describe('GET /qrcode/list', () => {
    it('should return all the qrCodes', async () => {
      const qrCodes: QrCode[] = [
        {
          qrCodeUrl:
            'https://image-charts.com/chart?chs=350x350&cht=qr&choe=UTF-8&icqrf=F3484F&chld=M&chof=.png&chl={"shopId":1,"table":1}',
          shopId: 1,
          table: 1,
          id: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          isOccupied: false,
        },
      ];

      const response = await request(app)
        .get('/qrcode/list')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toBeInstanceOf(Array);

      expect(response.body.length).toBeGreaterThanOrEqual(1);

      expect(response.body).toMatchObject(qrCodes);
    });
  });

  describe('DELETE /qrcode/delete/:id', () => {
    it('should return the deleted qrCode', async () => {
      const response = await request(app)
        .delete('/qrcode/delete/1')
        .set('Authorization', `bearer ${process.env.ADMIN_TOKEN}`)
        .set('x-api-key', `${process.env.API_KEY}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');

      expect(response.body.id).toEqual(1);
    });
  });
});
