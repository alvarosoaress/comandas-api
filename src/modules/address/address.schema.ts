import { createInsertSchema } from 'drizzle-zod';
import { address } from '../../../database/schema';
import { z } from 'zod';

const addressSchema = createInsertSchema(address);

export const createAddressSchema = z.object({
  body: addressSchema,
});

export const getAddressSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type createAddressType = z.infer<typeof createAddressSchema>['body'];
export type getAddressType = z.infer<typeof getAddressSchema>['params'];
