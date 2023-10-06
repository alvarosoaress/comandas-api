import { createInsertSchema } from 'drizzle-zod';
import { itemCategory } from '../../../database/schema';
import { z } from 'zod';

const itemCategorySchema = createInsertSchema(itemCategory);

export const itemCategoryCreateSchema = z.object({
  body: itemCategorySchema.omit({ createdAt: true, id: true, updatedAt: true }),
});

export const itemCategorySetSchema = z.object({
  body: z.object({
    itemId: z.number().positive(),
    itemCategoryId: z.number().positive(),
  }),
});

export const itemCategoryRemoveSchema = z.object({
  body: z.object({
    itemId: z.number().positive(),
    itemCategoryId: z.number().positive(),
  }),
});

export const itemCategoryGetSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type ItemCategoryCreateType = z.infer<
  typeof itemCategoryCreateSchema
>['body'];
export type ItemCategorySetType = z.infer<typeof itemCategorySetSchema>['body'];
export type ItemCategoryRemoveType = z.infer<
  typeof itemCategoryRemoveSchema
>['body'];
export type ItemCategoryGetType = z.infer<
  typeof itemCategoryGetSchema
>['params'];
