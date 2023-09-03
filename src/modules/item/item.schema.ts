import { createInsertSchema } from 'drizzle-zod';
import { type TypeOf, z } from 'zod';
import { item } from '../../../database/schema';

export const getItemsSchema = z.object({
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

export type getItemsType = TypeOf<typeof getItemsSchema>['params'];
export type createItemType = TypeOf<typeof createItemSchema>['body'];
