import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { item } from '../../../database/schema';

export const itemGetSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const itemDeleteSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const itemSchema = createInsertSchema(item, {
  name: (schema) => schema.name.min(3),
});

export const itemCreateSchema = z.object({
  body: itemSchema.omit({ createdAt: true, id: true, updatedAt: true }),
});

export const itemUpdateSchema = z.object({
  body: createInsertSchema(item, {
    price: (schema) => schema.price.optional(),
    name: (schema) => schema.name.optional(),
  })
    .omit({ createdAt: true, shopId: true })
    .merge(z.object({ id: z.number().positive() })),
});

export type ItemGetType = z.infer<typeof itemGetSchema>['params'];
export type ItemCreateType = z.infer<typeof itemCreateSchema>['body'];
export type ItemUpdateType = z.infer<typeof itemUpdateSchema>['body'];
export type ItemDeleteType = z.infer<typeof itemDeleteSchema>['params'];
