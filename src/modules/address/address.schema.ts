import { createInsertSchema } from 'drizzle-zod';
import { address } from '../../../database/schema';
import { z } from 'zod';

export const addressSchema = createInsertSchema(address);

export const addressSchemaUpdate = createInsertSchema(address, {
  number: (schema) => schema.number.positive().optional(),
  street: (schema) => schema.street.nonempty().optional(),
  state: (schema) => schema.street.nonempty().optional(),
  neighborhood: (schema) => schema.street.nonempty().optional(),
  country: (schema) => schema.street.nonempty().optional(),
  city: (schema) => schema.street.nonempty().optional(),
  id: z.number().positive().nonnegative(),
});

export const addressCreateSchema = z.object({
  body: addressSchema.omit({ id: true, createdAt: true, updatedAt: true }),
});

export const addressGetSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const addressUpdateSchema = z.object({
  body: addressSchemaUpdate
    .omit({
      refreshToken: true,
      role: true,
      createdAt: true,
      id: true,
    })
    .merge(z.object({ id: z.number().positive() })),
});

export type AddressCreateType = z.infer<typeof addressCreateSchema>['body'];
export type AddressGetType = z.infer<typeof addressGetSchema>['params'];
export type AddressUpdateType = z.infer<typeof addressUpdateSchema>['body'];
