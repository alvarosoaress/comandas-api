import { relations } from 'drizzle-orm';
import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
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
  role: mysqlEnum('role', ['client', 'shop']),
  refreshToken: varchar('refreshToken', { length: 256 }).unique(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
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
});

export const shop = mysqlTable('shops', {
  //   id: int('id').primaryKey().autoincrement(),
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
  qrCodeUrl: varchar('qrcode_url', { length: 256 }),
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

export const client = mysqlTable('clients', {
  //   id: int('id').primaryKey().autoincrement(),
  userId: int('user_id')
    .primaryKey()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  photoUrl: varchar('photo_url', { length: 256 }),
  birthday: timestamp('birthday'),
});

export const clientRelations = relations(client, ({ one, many }) => ({
  userInfo: one(user, {
    fields: [client.userId],
    references: [user.id],
  }),
}));

export const category = mysqlTable('categories', {
  id: int('id').primaryKey().autoincrement(),
  shopId: int('shop_id')
    .references(() => shop.userId, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categoryRelations = relations(category, ({ one }) => ({
  shop: one(shop, {
    fields: [category.shopId],
    references: [shop.userId],
  }),
}));

export const item = mysqlTable('items', {
  id: int('id').primaryKey().autoincrement(),
  shopId: int('shop_id')
    .references(() => shop.userId, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  categoryId: int('category_id').references(() => category.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 256 }),
  price: real('price', { precision: 10, scale: 2 }).notNull(),
  temperature: mysqlEnum('temperature', ['cold', 'hot']),
  vegan: boolean('vegan'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
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
