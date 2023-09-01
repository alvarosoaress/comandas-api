import { createInsertSchema } from 'drizzle-zod';
import { address } from '../../database/schema';
import { type TypeOf, z } from 'zod';

const addressSchema = createInsertSchema(address);

export const createAddressSchema = z.object({
  body: addressSchema
})

export const getAddressByIdSchema = z.object({
  params: z.object({
    id: z.string()
  })
})

export type getAddressByIdType = TypeOf<typeof getAddressByIdSchema>['params'];
export type createAddressType = TypeOf<typeof createAddressSchema>['body'];
