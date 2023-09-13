import { addressSchema } from '../address/address.schema';
import { userSchema } from './../user/user.schema';
import { z } from 'zod';

export const createShopSchema = z.object({
  body: z.object({
    userInfo: userSchema,
    addressInfo: addressSchema,
  }),
});

// id Se torna uma string pois os params vem na url
// tudo na url é string
export const getShopSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const getShopMenuSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type createShopType = z.infer<typeof createShopSchema>['body'];
export type getShopType = z.infer<typeof getShopSchema>['params'];
export type getShopMenuType = z.infer<typeof getShopMenuSchema>['params'];
