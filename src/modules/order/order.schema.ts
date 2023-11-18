import { createInsertSchema } from 'drizzle-zod';
import { order } from '../../../database/schema';
import { z } from 'zod';

export const orderSchema = createInsertSchema(order);

export const orderGetSchema = z.object({
  params: z.object({
    groupId: z.string(),
  }),
});

export const orderGetByTableSchema = z.object({
  params: z.object({
    tableId: z.string(),
  }),
});

export const orderCreateSchema = z.object({
  body: z.array(
    orderSchema.omit({
      createdAt: true,
      status: true,
      updatedAt: true,
      id: true,
      groupId: true,
    }),
  ),
});

export const orderCompleteSchema = z.object({
  params: z.object({
    groupId: z.string(),
    updatedAt: z.date().optional(),
  }),
});

export const orderCancelSchema = z.object({
  params: z.object({
    groupId: z.string(),
    updatedAt: z.date().optional(),
  }),
});

export type OrderCreateType = z.infer<typeof orderCreateSchema>['body'];
export type OrderGetType = z.infer<typeof orderGetSchema>['params'];
export type OrderGetByTableType = z.infer<
  typeof orderGetByTableSchema
>['params'];
export type OrderCompleteType = z.infer<typeof orderCompleteSchema>['params'];
export type OrderCancelType = z.infer<typeof orderCancelSchema>['params'];
