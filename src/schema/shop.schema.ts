import { type TypeOf, z } from 'zod';

export const createShopSchema = z.object({
  body: z.object({
    userId: z.number().positive(),
    addressId: z.number().positive()
  })
})

export type createShopType = TypeOf<typeof createShopSchema>['body'];
