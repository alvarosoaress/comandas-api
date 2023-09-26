import { relations } from 'drizzle-orm';
import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  real,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const user = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  password: varchar('password', { length: 256 }).notNull(),
  phoneNumber: int('phone_number'),
  role: mysqlEnum('role', ['customer', 'shop']),
  refreshToken: varchar('refreshToken', { length: 256 }).unique(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const address = mysqlTable('addresses', {
  id: int('id').primaryKey().autoincrement(),
  street: varchar('street', { length: 256 }).notNull(),
  number: int('number').notNull(),
  neighborhood: varchar('neighborhood', { length: 256 }).notNull(),
  city: varchar('city', { length: 256 }).notNull(),
  state: varchar('state', { length: 256 }).notNull(),
  country: varchar('country', { length: 256 }).notNull(),
  zipcode: int('zipcode'),
  lat: varchar('lat', { length: 256 }),
  long: varchar('long', { length: 256 }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const generalCategory = mysqlTable('general_categories', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const generalCategoryRelations = relations(
  generalCategory,
  ({ many }) => ({
    shops: many(shopCategory),
  }),
);

export const shop = mysqlTable('shops', {
  userId: int('user_id')
    .primaryKey()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  addressId: int('address_id')
    .notNull()
    .references(() => address.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  tables: int('tables'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const shopRelations = relations(shop, ({ one, many }) => ({
  userInfo: one(user, {
    fields: [shop.userId],
    references: [user.id],
  }),
  addressInfo: one(address, {
    fields: [shop.addressId],
    references: [address.id],
  }),
  categories: many(shopCategory),
  menu: many(item),
  qrCodes: many(qrCode),
  itemCategories: many(itemCategory),
}));

export const shopCategory = mysqlTable(
  'shop_categories',
  {
    shopId: int('shop_id')
      .notNull()
      .references(() => shop.userId),
    generalCategoryId: int('general_category_id')
      .notNull()
      .references(() => generalCategory.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  },
  (table) => {
    return { pk: primaryKey(table.shopId, table.generalCategoryId) };
  },
);

export const shopCategoryRelations = relations(shopCategory, ({ one }) => ({
  shops: one(shop, {
    fields: [shopCategory.shopId],
    references: [shop.userId],
  }),
  categories: one(generalCategory, {
    fields: [shopCategory.generalCategoryId],
    references: [generalCategory.id],
  }),
}));

export const qrCode = mysqlTable('shops_qrcodes', {
  id: int('id').primaryKey().autoincrement(),
  shopId: int('shop_id')
    .notNull()
    .references(() => shop.userId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  qrcodeUrl: varchar('qrcode_url', { length: 256 }).notNull().unique(),
  table: int('table_number').notNull(),
  isOccupied: boolean('is_occupied').default(false).notNull(),
});

export const qrCodeRelations = relations(qrCode, ({ one }) => ({
  shop: one(shop, {
    fields: [qrCode.shopId],
    references: [shop.userId],
  }),
}));

export const customer = mysqlTable('customer', {
  userId: int('user_id')
    .primaryKey()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  photoUrl: varchar('photo_url', { length: 256 }),
  birthday: timestamp('birthday'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const costumerRelations = relations(customer, ({ one, many }) => ({
  userInfo: one(user, {
    fields: [customer.userId],
    references: [user.id],
  }),
}));

export const itemCategory = mysqlTable('item_categories', {
  id: int('id').primaryKey().autoincrement(),
  shopId: int('shop_id')
    .references(() => shop.userId, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const itemCategoryRelations = relations(itemCategory, ({ one }) => ({
  shop: one(shop, {
    fields: [itemCategory.shopId],
    references: [shop.userId],
  }),
}));

export const item = mysqlTable('items', {
  id: int('id').primaryKey().autoincrement(),
  shopId: int('shop_id')
    .references(() => shop.userId, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  categoryId: int('category_id').references(() => itemCategory.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 256 }),
  price: real('price', { precision: 10, scale: 2 }).notNull(),
  temperature: mysqlEnum('temperature', ['cold', 'hot']),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const itemRelations = relations(item, ({ one }) => ({
  category: one(itemCategory, {
    fields: [item.categoryId],
    references: [itemCategory.id],
  }),
  shop: one(shop, {
    fields: [item.shopId],
    references: [shop.userId],
  }),
}));

// export const cart = mysqlTable(
//   'cart',
//   {
//     clientId: int('client_id').references(() => client.userId, {
//       onDelete: 'cascade',
//       onUpdate: 'cascade',
//     }),
//     shopId: int('shop_id').references(() => shop.userId, {
//       onDelete: 'cascade',
//       onUpdate: 'cascade',
//     }),
//     itemId: int('item_id').references(() => item.id, {
//       onDelete: 'cascade',
//       onUpdate: 'cascade',
//     }),
//     quantity: int('quantity').notNull(),
//     updatedAt: timestamp('updatedAt').defaultNow().notNull(),
//     // TotalPrice é para ser calculado no frontEnd
//     //   totalPrice: real('total_price', { precision: 10, scale: 2 }).notNull(),
//   },
//   (table) => {
//     return { pk: primaryKey(table.clientId, table.itemId, table.shopId) };
//   },
// );

export const order = mysqlTable(
  'orders',
  {
    clientId: int('client_id')
      .references(() => customer.userId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    shopId: int('shop_id')
      .references(() => shop.userId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    itemId: int('item_id')
      .references(() => item.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    quantity: int('quantity').notNull(),
    total: int('total').notNull(),
    isCompleted: boolean('is_completed').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return { pk: primaryKey(table.clientId, table.itemId, table.shopId) };
  },
);

export const ordersRelations = relations(order, ({ one }) => ({
  item: one(item, {
    fields: [order.itemId],
    references: [item.id],
  }),
}));

// TODO Inserir UpdatedAt em todas colunas

export type GeneralCategory = typeof generalCategory.$inferInsert;
export type ShopCategory = typeof shopCategory.$inferInsert;

export type ShopCategories = {
  categories?: Array<{ id: number; name: string }>;
};

export type User = typeof user.$inferInsert;
export type UserSafe = Omit<User, 'password' | 'refreshToken'>;

export type Address = typeof address.$inferInsert;

export type Customer = typeof customer.$inferInsert;
export type CustomerWithoutId = Omit<Customer, 'userId'>;
export type CustomerExtended = typeof customer.$inferInsert & {
  userInfo: User;
};
export type CustomerExtendedSafe = typeof customer.$inferInsert & {
  userInfo: UserSafe;
};

export type Shop = typeof shop.$inferInsert;
export type ShopWithCategories = typeof shop.$inferInsert & {
  categories?: Array<{ id: number; name: string }>;
};
export type ShopWithoutId = { addressId?: number } & Omit<
  Shop,
  'userId' | 'addressId'
>;
export type ShopExtended = typeof shop.$inferInsert & {
  categories?: Array<{ id: number; name: string }>;
  userInfo: User;
  addressInfo: Address;
};

export type ShopExtendedSafe = typeof shop.$inferInsert & {
  categories?: Array<{ id: number; name: string }>;
  userInfo: UserSafe;
  addressInfo: Address;
};

export type Item = typeof item.$inferInsert;

export type ItemCategory = typeof itemCategory.$inferInsert;

export type QrCode = typeof qrCode.$inferInsert;

export type Order = typeof order.$inferSelect;
