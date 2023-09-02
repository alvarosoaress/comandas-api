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
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export const userRelations = relations(user, ({ one }) => ({
  address: one(address, {
    fields: [user.addressId],
    references: [address.id],
  }),
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

export const menuCategory = mysqlTable('menu_categories', {
  id: int('id').primaryKey().autoincrement(),
  shopId: int('shop_id')
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const menuCategoryRelations = relations(menuCategory, ({ one }) => ({
  shop: one(user, {
    fields: [menuCategory.shopId],
    references: [user.id],
  }),
}));

export const menuItem = mysqlTable('menu_items', {
  id: int('id').primaryKey().autoincrement(),
  shopId: int('shop_id')
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  categoryId: int('category_id').references(() => menuCategory.id, {
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

export const menuItemRelations = relations(menuItem, ({ one }) => ({
  shop: one(user, {
    fields: [menuItem.shopId],
    references: [user.id],
  }),
  category: one(menuCategory, {
    fields: [menuItem.categoryId],
    references: [menuCategory.id],
  }),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type MenuItem = typeof menuItem.$inferInsert;
