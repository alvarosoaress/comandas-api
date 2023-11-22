import { createInsertSchema } from 'drizzle-zod';
import { addressSchema } from '../address/address.schema';
import { userSchema } from './../user/user.schema';
import { z } from 'zod';
import { type ShopSchedule, shop } from '../../../database/schema';

// export const shopSchema = z.object({
//   tables: z.number().positive().optional(),
//   categoryId: z.number().positive().optional(),
// });

export const shopSchema = createInsertSchema(shop, {
  tables: z.number(),
}).omit({
  addressId: true,
  createdAt: true,
  userId: true,
  updatedAt: true,
});

export const shopCreateSchema = z.object({
  body: z.object({
    shopInfo: shopSchema,
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

export const shopGetQrCodeSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const shopGetItemCategorySchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const shopGetOrderSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const shopGetScheduleSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const shopGetReviewSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const shopUpdateSchema = z.object({
  body: createInsertSchema(shop).omit({
    addressId: true,
    createdAt: true,
    rating: true,
  }),
});

export const shopListSchema = z.object({
  query: z
    .object({
      limit: z.string().nonempty().optional(),
      state: z.string().nonempty().optional(),
      country: z.string().nonempty().optional(),
      city: z.string().nonempty().optional(),
      categories: z.array(z.string().nonempty()).optional(),
      tables: z.string().nonempty().optional(),
      mintables: z.string().nonempty().optional(),
      maxtables: z.string().nonempty().optional(),
      search: z.string().nonempty().optional(),
    })
    .optional(),
});

export type ShopListResType = {
  name: string;
  tables: number;
  user_id: number;
  createdAt: string;
  updatedAt: string;
  address_id: number;
  city: string;
  state: string;
  street: string;
  country: string;
  lat: string;
  long: string;
  neighborhood: string;
  number: number;
  email: string;
  phone_number: number;
  category_name: string;
  category_id: number;
  rating: number;
  photo_url?: string;
  schedule: ShopSchedule[];
};
export type ShopCreateType = z.infer<typeof shopCreateSchema>['body'];
export type ShopGetType = z.infer<typeof shopGetSchema>['params'];
export type ShopGetMenuType = z.infer<typeof shopGetMenuSchema>['params'];
export type ShopGetQrCodeType = z.infer<typeof shopGetQrCodeSchema>['params'];
export type ShopGetOrderType = z.infer<typeof shopGetOrderSchema>['params'];
export type ShopGetScheduleType = z.infer<
  typeof shopGetScheduleSchema
>['params'];
export type ShopGetReviewType = z.infer<typeof shopGetReviewSchema>['params'];
export type ShopGetItemCategoryType = z.infer<
  typeof shopGetItemCategorySchema
>['params'];
export type ShopUpdateType = z.infer<typeof shopUpdateSchema>['body'];
export type ShopListType = z.infer<typeof shopListSchema>['query'];
