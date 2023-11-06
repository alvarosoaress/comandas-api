import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { review } from '../../../database/schema';

export const reviewSchema = createInsertSchema(review, {
  rating: z.number().min(1),
});

export const reviewCreateSchema = z.object({
  body: reviewSchema.omit({ createdAt: true, updatedAt: true, id: true }),
});

export const reviewUpdateSchema = z.object({
  body: reviewSchema
    .omit({ createdAt: true, id: true, customerId: true, shopId: true })
    .merge(z.object({ id: z.number().positive() })),
});

export const reviewDeleteSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type ReviewCreateType = z.infer<typeof reviewCreateSchema>['body'];
export type ReviewUpdateType = z.infer<typeof reviewUpdateSchema>['body'];
export type ReviewDeleteType = z.infer<typeof reviewDeleteSchema>['params'];
