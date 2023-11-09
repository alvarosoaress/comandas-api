import { createInsertSchema } from 'drizzle-zod';
import { userSchema } from '../user/user.schema';
import { z } from 'zod';
import { customer } from '../../../database/schema';

export const customerSchema = createInsertSchema(customer, {
  birthday: z.string(),
});

export const customerCreateSchema = z.object({
  body: z.object({
    customerInfo: customerSchema.omit({ userId: true }).optional(),
    userInfo: userSchema.omit({
      createdAt: true,
      id: true,
      updatedAt: true,
      refreshToken: true,
    }),
  }),
});

// id Se torna uma string pois os params vem na url
// tudo na url é string
export const customerGetSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const customerGetOrderSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const customerUpdateSchema = z.object({
  body: customerSchema.omit({ createdAt: true }),
});

export type CustomerCreateType = z.infer<typeof customerCreateSchema>['body'];
export type CustomerGetType = z.infer<typeof customerGetSchema>['params'];
export type CustomerGetOrderType = z.infer<
  typeof customerGetOrderSchema
>['params'];
export type CustomerUpdateType = z.infer<typeof customerUpdateSchema>['body'];
