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
