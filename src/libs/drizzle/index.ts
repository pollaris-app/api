import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export const dbData: mysql.ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: true,
  },
};

export const clientConnection = await mysql.createConnection(dbData);
export const poolConnection = await mysql.createPool(dbData);

export const dbClient = drizzle(clientConnection);
export const dbPool = drizzle(poolConnection);
