import { type TypeOf, z } from 'zod';

export const createShopSchema = z.object({
  body: z.object({
    userId: z.number().positive(),
    addressId: z.number().positive(),
  }),
});

// id Se torna uma string pois os params vem na url
// tudo na url é string
export const getShopSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type createShopType = TypeOf<typeof createShopSchema>['body'];
export type getShopType = TypeOf<typeof getShopSchema>['params'];
