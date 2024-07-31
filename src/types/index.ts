import { MySql2Database } from "drizzle-orm/mysql2";

export type Database = MySql2Database<Record<string, never>>;
