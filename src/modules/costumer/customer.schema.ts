import { createInsertSchema } from 'drizzle-zod';
import { userSchema } from '../user/user.schema';
import { z } from 'zod';
import { customer } from '../../../database/schema';

export const customerSchema = createInsertSchema(customer);

export const customerSchemaWithoutId = createInsertSchema(customer, {
  userId: z.number().optional(),
});

export const createCustomerSchema = z.object({
  body: z.object({
    customerInfo: customerSchemaWithoutId.optional(),
    userInfo: userSchema,
  }),
});

// id Se torna uma string pois os params vem na url
// tudo na url é string
export const getCustomerSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const updateCustomerSchema = z.object({
  body: customerSchema,
});

export type createCustomerType = z.infer<typeof createCustomerSchema>['body'];
export type getCustomerType = z.infer<typeof getCustomerSchema>['params'];
export type updateCustomerType = z.infer<typeof updateCustomerSchema>['body'];
