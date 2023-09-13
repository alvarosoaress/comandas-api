import { createInsertSchema } from 'drizzle-zod';
import { user } from '../../../database/schema';
import { z } from 'zod';

export const userSchema = createInsertSchema(user, {
  name: (schema) => schema.name.min(3),
  email: (schema) => schema.email.email(),
});

export const createUserSchema = z.object({
  body: userSchema,
});

export const userLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const getUserByEmailSchema = z.object({
  params: z.object({
    email: z.string(),
  }),
});

export const updateAccessSchema = z.object({
  body: z.object({
    id: z.number().positive(),
  }),
});

export type createUserType = z.infer<typeof createUserSchema>['body'];
export type userLoginType = z.infer<typeof userLoginSchema>['body'];
export type getUserByIdType = z.infer<typeof getUserByIdSchema>['params'];
export type getUserByEmailType = z.infer<typeof getUserByEmailSchema>['params'];
export type updateAccessTokenType = z.infer<typeof updateAccessSchema>['body'];
