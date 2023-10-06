import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { generalCategory } from '../../../database/schema';

export const generalCategorySchema = createInsertSchema(generalCategory, {
  name: (schema) => schema.name.min(3),
});

export const generalCategoryGetSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const generalCategoryCreateSchema = z.object({
  body: generalCategorySchema.omit({
    createdAt: true,
    id: true,
    updatedAt: true,
  }),
});

export const generalCategoryUpdateSchema = z.object({
  body: createInsertSchema(generalCategory, {
    name: (schema) => schema.name.min(3).optional(),
  })
    .omit({ createdAt: true })
    .merge(z.object({ id: z.number().positive() })),
});

export const generalCategoryDeleteSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const generalCategoryShopListSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const generalCategorySetSchema = z.object({
  body: z.object({
    shopId: z.number().positive(),
    generalCategoryId: z.number().positive().array(),
  }),
});

export type GeneralCategoryGetType = z.infer<
  typeof generalCategoryGetSchema
>['params'];
export type GeneralCategoryCreateType = z.infer<
  typeof generalCategoryCreateSchema
>['body'];
export type GeneralCategoryUpdateType = z.infer<
  typeof generalCategoryUpdateSchema
>['body'];
export type GeneralCategoryDeleteType = z.infer<
  typeof generalCategoryDeleteSchema
>['params'];
export type GeneralCategorySetType = z.infer<
  typeof generalCategorySetSchema
>['body'];
export type GeneralCategoryShopListType = z.infer<
  typeof generalCategoryShopListSchema
>['params'];
export type GeneralCategoryShopType = Array<{
  name: string;
  id: number;
}>;
