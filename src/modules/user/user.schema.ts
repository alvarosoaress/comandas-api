import { createInsertSchema } from 'drizzle-zod';
import { user } from '../../../database/schema';
import { z } from 'zod';

export const userSchema = createInsertSchema(user, {
  name: (schema) => schema.name.min(3).nonempty(),
  email: (schema) => schema.email.email().nonempty(),
  password: (schema) => schema.password.nonempty(),
});

export const userSchemaUpdate = createInsertSchema(user, {
  name: (schema) => schema.name.min(3).nonempty().optional(),
  email: (schema) => schema.email.email().nonempty().optional(),
  password: (schema) => schema.password.nonempty().optional(),
  id: z.number().positive().nonnegative(),
});

export const userCreateSchema = z.object({
  body: userSchema.omit({
    createdAt: true,
    refreshToken: true,
    id: true,
    updatedAt: true,
  }),
});

export const userLoginSchema = z.object({
  body: z.object({
    email: z.string().email().nonempty(),
    password: z.string().nonempty(),
  }),
});

export const userGetByIdSchema = z.object({
  params: z.object({
    id: z.string().nonempty(),
  }),
});

export const userGetByEmailSchema = z.object({
  params: z.object({
    email: z.string().email().nonempty(),
  }),
});

export const userUpdateAccessSchema = z.object({
  body: z.object({
    id: z.number().positive(),
  }),
});

export const userUpdateSchema = z.object({
  body: userSchemaUpdate
    .omit({
      refreshToken: true,
      role: true,
      createdAt: true,
      id: true,
    })
    .merge(z.object({ id: z.number().positive() })),
});

export type UserCreateType = z.infer<typeof userCreateSchema>['body'];
export type UserLoginType = z.infer<typeof userLoginSchema>['body'];
export type UserGetByIdType = z.infer<typeof userGetByIdSchema>['params'];
export type UserGetByEmailType = z.infer<typeof userGetByEmailSchema>['params'];
export type UserUpdateType = z.infer<typeof userUpdateSchema>['body'];
export type UserUpdateAccessTokenType = z.infer<
  typeof userUpdateAccessSchema
>['body'];
