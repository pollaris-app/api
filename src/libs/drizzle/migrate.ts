import { dbClient, clientConnection } from ".";
import { migrate } from "drizzle-orm/mysql2/migrator";

await migrate(dbClient, { migrationsFolder: ".drizzle" });
await clientConnection.end();

console.log("Migration complete");

process.exit();
