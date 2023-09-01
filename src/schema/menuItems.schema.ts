import { createInsertSchema } from 'drizzle-zod';
import { type TypeOf, z } from 'zod';
import { menuItem } from '../../database/schema';

export const getMenuItemsSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const menuItemSchema = createInsertSchema(menuItem, {
  name: (schema) => schema.name.min(3),
});

export const createMenuItemSchema = z.object({
  body: menuItemSchema,
});

export type getMenuItemsType = TypeOf<typeof getMenuItemsSchema>['params'];
export type createMenuItemType = TypeOf<typeof createMenuItemSchema>['body'];
