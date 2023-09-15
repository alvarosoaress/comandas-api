import { createInsertSchema } from 'drizzle-zod';
import { address } from '../../../database/schema';
import { z } from 'zod';

export const addressSchema = createInsertSchema(address);

export const addressCreateSchema = z.object({
  body: addressSchema.omit({ id: true, createdAt: true, updatedAt: true }),
});

export const addressGetSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type AddressCreateType = z.infer<typeof addressCreateSchema>['body'];
export type AddressGetType = z.infer<typeof addressGetSchema>['params'];
