import { pgTable, text, timestamp, boolean, serial, jsonb, integer, varchar } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified'),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refreshToken: text('refreshToken'),
  accessToken: text('accessToken'),
  expiresAt: integer('expiresAt'),
  token_type: text('token_type'),
  scope: text('scope'),
  idToken: text('idToken'),
  session_state: text('session_state'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------

export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  eventType: varchar('eventType', { length: 50 }).notNull(),
  eventData: jsonb('eventData').notNull(),
  url: text('url'),
  tabTitle: text('tabTitle'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export const screenshots = pgTable('screenshots', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  screenshotUrl: text('screenshotUrl').notNull(),
  thumbnailUrl: text('thumbnailUrl'),
  aiAnalysis: jsonb('aiAnalysis'),
  captureTime: timestamp('captureTime').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  trackingEnabled: boolean('trackingEnabled').notNull().default(true),
  screenshotIntervalSeconds: integer('screenshotIntervalSeconds').notNull().default(60),
  excludedUrls: text('excludedUrls').array().default([]),
  whitelistUrls: text('whitelistUrls').array().default([]),
  aiAnalysisEnabled: boolean('aiAnalysisEnabled').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})
