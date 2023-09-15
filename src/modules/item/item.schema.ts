import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { item } from '../../../database/schema';

export const itemGetSchema = z.object({
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
  body: itemSchema.omit({ createdAt: true, shopId: true }),
});

export type ItemGetType = z.infer<typeof itemGetSchema>['params'];
export type ItemCreateType = z.infer<typeof itemCreateSchema>['body'];
export type ItemUpdateType = z.infer<typeof itemUpdateSchema>['body'];
