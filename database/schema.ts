import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  pgEnum,
  primaryKey,
  decimal,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['client', 'shop']);

export const temperatureEnum = pgEnum('temperature', ['cold', 'hot']);

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  password: varchar('password', { length: 256 }).notNull(),
  phoneNumber: integer('phone_number'),
  role: roleEnum('role'),
  refreshToken: varchar('refreshToken', { length: 256 }).unique(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const address = pgTable('addresses', {
  id: serial('id').primaryKey(),
  street: varchar('street', { length: 256 }).notNull(),
  number: integer('number').notNull(),
  neighborhood: varchar('neighborhood', { length: 256 }).notNull(),
  city: varchar('city', { length: 256 }).notNull(),
  state: varchar('state', { length: 256 }).notNull(),
  country: varchar('country', { length: 256 }).notNull(),
  zipcode: integer('zipcode'),
  lat: varchar('lat', { length: 256 }),
  long: varchar('long', { length: 256 }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const shop = pgTable('shops', {
  //   id: int('id').primaryKey().autoincrement(),
  userId: integer('user_id')
    .primaryKey()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  addressId: integer('address_id')
    .notNull()
    .references(() => address.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  qrCodeUrl: varchar('qrcode_url', { length: 256 }),
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
  menu: many(item),
}));

export const client = pgTable('clients', {
  //   id: int('id').primaryKey().autoincrement(),
  userId: integer('user_id')
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

export const clientRelations = relations(client, ({ one, many }) => ({
  userInfo: one(user, {
    fields: [client.userId],
    references: [user.id],
  }),
}));

export const category = pgTable('categories', {
  id: serial('id').primaryKey(),
  shopId: integer('shop_id')
    .references(() => shop.userId, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const categoryRelations = relations(category, ({ one }) => ({
  shop: one(shop, {
    fields: [category.shopId],
    references: [shop.userId],
  }),
}));

export const item = pgTable('items', {
  id: serial('id').primaryKey(),
  shopId: integer('shop_id')
    .references(() => shop.userId, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  categoryId: integer('category_id').references(() => category.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 256 }),
  price: decimal('price', { precision: 2 }).notNull(),
  temperature: temperatureEnum('temperature'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const itemRelations = relations(item, ({ one }) => ({
  shop: one(shop, {
    fields: [item.shopId],
    references: [shop.userId],
  }),
  category: one(category, {
    fields: [item.categoryId],
    references: [category.id],
  }),
}));

export const cart = pgTable(
  'cart',
  {
    clientId: integer('client_id').references(() => client.userId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    shopId: integer('shop_id').references(() => shop.userId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    itemId: integer('item_id').references(() => item.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    quantity: integer('quantity').notNull(),
    // TotalPrice é para ser calculado no frontEnd
    //   totalPrice: real('total_price', { precision: 10, scale: 2 }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.clientId, table.itemId, table.shopId),
    };
  },
);

// TODO Inserir UpdatedAt em todas colunas

export type User = typeof user.$inferInsert;
export type UserSafe = Omit<User, 'password' | 'refreshToken'>;

export type Address = typeof address.$inferInsert;

export type Client = typeof client.$inferInsert & {
  userInfo: User;
};
export type ClientSafe = typeof client.$inferInsert & {
  userInfo: UserSafe;
};

export type Shop = Omit<typeof shop.$inferInsert, 'userId'> & {
  userInfo: User;
  addressInfo: Address;
};
export type ShopSafe = Omit<typeof shop.$inferInsert, 'userId'> & {
  userInfo: UserSafe;
  addressInfo: Address;
};

export type Item = typeof item.$inferInsert;
