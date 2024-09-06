import { boolean, date, int, mysqlTable, text } from "drizzle-orm/mysql-core";
import { relations, type InferSelectModel } from "drizzle-orm";

export const polls = mysqlTable("polls", {
  id: int("id").primaryKey().autoincrement(),
  title: text("title").notNull(),
});

export type PollsInsert = typeof polls.$inferInsert;
export type PollsSelect = typeof polls.$inferSelect;

export const quizzes = mysqlTable("quizzes", {
  id: int("id").primaryKey().autoincrement(),
  title: text("title").notNull(),
});

export type QuizzesInsert = typeof quizzes.$inferInsert;
export type QuizzesSelect = typeof quizzes.$inferSelect;

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  email_verified: boolean("email_verified").notNull().default(false),
});

export type UsersInsert = typeof users.$inferInsert;
export type UsersSelect = typeof users.$inferSelect;

export const accounts = mysqlTable("accounts", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  username: text("username").notNull(),
  avatar: text("avatar").notNull(),
});

export type AccountsInsert = typeof accounts.$inferInsert;
export type AccountsSelect = typeof accounts.$inferSelect;

export const emailVerifications = mysqlTable("email_verifications", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  token: text("token").notNull(),
  code: text("code").notNull(),
  expiresAt: date("expires_at").notNull(),
});

export type EmailVerificationsInsert = typeof emailVerifications.$inferInsert;
export type EmailVerificationsSelect = typeof emailVerifications.$inferSelect;

export const passwordResets = mysqlTable("password_resets", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  token: text("token").notNull(),
  expiresAt: date("expires_at").notNull(),
});

export type PasswordResetsInsert = typeof passwordResets.$inferInsert;
export type PasswordResetsSelect = typeof passwordResets.$inferSelect;

export const sessions = mysqlTable("sessions", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  expiresAt: date("expires_at").notNull(),
  fresh: boolean("fresh").notNull().default(false),
});

export type SessionsInsert = typeof sessions.$inferInsert;
export type SessionsSelect = typeof sessions.$inferSelect;
