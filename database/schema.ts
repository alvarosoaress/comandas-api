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
  photoUrl: varchar('photo_url', { length: 256 }),
  birthday: timestamp('birthday'),
  addressId: int('address_id').references(() => address.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  role: mysqlEnum('role', ['client', 'shop']).notNull(),
  refreshToken: varchar('refreshToken', { length: 256 }).unique(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export const userRelations = relations(user, ({ one, many }) => ({
  address: one(address, {
    fields: [user.addressId],
    references: [address.id],
  }),
  item: many(item),
}));

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

export const category = mysqlTable('categories', {
  id: int('id').primaryKey().autoincrement(),
  shopId: int('shop_id')
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categoryRelations = relations(category, ({ one }) => ({
  shop: one(user, {
    fields: [category.shopId],
    references: [user.id],
  }),
}));

export const item = mysqlTable('items', {
  id: int('id').primaryKey().autoincrement(),
  shopId: int('shop_id')
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  categoryId: int('category_id').references(() => category.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 256 }).notNull(),
  price: real('price', { precision: 10, scale: 2 }).notNull(),
  temperature: mysqlEnum('temperature', ['cold', 'hot']),
  vegan: boolean('vegan'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const menuItemRelations = relations(item, ({ one }) => ({
  shop: one(user, {
    fields: [item.shopId],
    references: [user.id],
  }),
  category: one(category, {
    fields: [item.categoryId],
    references: [category.id],
  }),
}));

export type User = typeof user.$inferInsert;

export type Address = typeof address.$inferInsert;

export type Item = typeof item.$inferInsert;
