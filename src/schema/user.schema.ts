import { createInsertSchema } from 'drizzle-zod';
import { user } from '../../database/schema';
import { type TypeOf, z } from 'zod';

const userSchema = createInsertSchema(user, {
  name: (schema) => schema.name.min(3),
  email: (schema) => schema.email.email()
});

export const createUserSchema = z.object({
  body: userSchema
})

export const userLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  })
})

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string()
  })
})

export type createUserType = TypeOf<typeof createUserSchema>['body'];
export type userLoginType = TypeOf<typeof userLoginSchema>['body'];
export type getUserByIdType = TypeOf<typeof getUserByIdSchema>['params'];
