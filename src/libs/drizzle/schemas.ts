import { int, mysqlTable, text } from "drizzle-orm/mysql-core";

export const polls = mysqlTable("polls", {
  id: int("id").primaryKey().autoincrement(),
  title: text("title").notNull(),
});

export const quizzes = mysqlTable("quizzes", {
  id: int("id").primaryKey().autoincrement(),
  title: text("title").notNull(),
});
