import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: ".drizzle",
  schema: "./src/libs/drizzle/schemas.ts",
  dialect: "mysql",
  dbCredentials: {
    url: String(process.env.DB_URL),
  },
  verbose: true,
  strict: true,
});
