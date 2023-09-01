import { createInsertSchema } from 'drizzle-zod';
import { address } from '../../database/schema';
import { type TypeOf, z } from 'zod';

const addressSchema = createInsertSchema(address);

export const createAddressSchema = z.object({
  body: addressSchema
})

export type createAddressType = TypeOf<typeof createAddressSchema>['body'];
