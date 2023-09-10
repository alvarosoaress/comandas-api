import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { item } from '../../../database/schema';

export const getItemSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const itemSchema = createInsertSchema(item, {
  name: (schema) => schema.name.min(3),
});

export const createItemSchema = z.object({
  body: itemSchema,
});

export const updateItemSchema = z.object({
  body: itemSchema,
});

export type getItemType = z.infer<typeof getItemSchema>['params'];
export type createItemType = z.infer<typeof createItemSchema>['body'];
export type updateItemType = z.infer<typeof updateItemSchema>['body'];
