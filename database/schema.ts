import { relations } from 'drizzle-orm';
import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  password: varchar('hashPassword', { length: 256 }).notNull(),
  phoneNumber: int('phone_number'),
  photoUrl: varchar('photo_url', { length: 256 }),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

export const client = mysqlTable('clients', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').references(() => user.id).notNull(),
  birthday: timestamp('birthday')
});

export const clientRelations = relations(client, ({ one }) => ({
  userId: one(user, {
    fields: [client.userId],
    references: [user.id]
  })
}))

export const shop = mysqlTable('shops', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').references(() => user.id).notNull(),
  addressId: int('address_id').references(() => address.id).notNull()
});

export const shopRelations = relations(shop, ({ one }) => ({
  userId: one(user, {
    fields: [shop.userId],
    references: [user.id]
  }),
  addressId: one(address, {
    fields: [shop.addressId],
    references: [address.id]
  })
}))

export const address = mysqlTable('address', {
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
  birthday: timestamp('birthday').defaultNow()
});

export type User = typeof user.$inferSelect; // return type when queried
export type NewUser = typeof user.$inferInsert; // insert type

// export type Shop = typeof shop.$inferSelect; // return type when queried
export type NewShop = typeof shop.$inferInsert; // insert type

// export type Client = typeof client.$inferSelect; // return type when queried
export type NewClient = typeof client.$inferInsert; // insert type

// export type Address = typeof address.$inferSelect; // return type when queried
export type NewAdress = typeof address.$inferInsert; // insert type
