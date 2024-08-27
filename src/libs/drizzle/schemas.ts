import { int, mysqlTable, text } from "drizzle-orm/mysql-core";
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
});

export type UsersInsert = typeof users.$inferInsert;
export type UsersSelect = typeof users.$inferSelect;

export const accounts = mysqlTable("accounts", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  username: text("username").notNull(),
});

export type AccountsInsert = typeof accounts.$inferInsert;
export type AccountsSelect = typeof accounts.$inferSelect;
