import { createInsertSchema } from 'drizzle-zod';
import { addressSchema } from '../address/address.schema';
import { userSchema } from './../user/user.schema';
import { z } from 'zod';
import { shop } from '../../../database/schema';

// export const shopSchema = z.object({
//   tables: z.number().positive().optional(),
//   categoryId: z.number().positive().optional(),
// });

export const shopSchema = createInsertSchema(shop, {
  tables: z.number().optional(),
}).omit({
  addressId: true,
  createdAt: true,
  userId: true,
  updatedAt: true,
});

export const shopCreateSchema = z.object({
  body: z.object({
    shopInfo: shopSchema.optional(),
    userInfo: userSchema.omit({
      createdAt: true,
      id: true,
      updatedAt: true,
      refreshToken: true,
    }),
    addressInfo: addressSchema.omit({
      createdAt: true,
      updatedAt: true,
      id: true,
    }),
  }),
});

// id Se torna uma string pois os params vem na url
// tudo na url é string
export const shopGetSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const shopGetMenuSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

const teste = createInsertSchema(shop).omit({
  addressId: true,
  createdAt: true,
});

export const shopUpdateSchema = z.object({
  body: z
    .object({
      categories: z
        .array(z.object({ id: z.number(), name: z.string() }))
        .optional(),
    })
    .merge(teste),
});

export type ShopCreateType = z.infer<typeof shopCreateSchema>['body'];
export type ShopGetType = z.infer<typeof shopGetSchema>['params'];
export type ShopGetMenuType = z.infer<typeof shopGetMenuSchema>['params'];
export type ShopUpdateType = z.infer<typeof shopUpdateSchema>['body'];
