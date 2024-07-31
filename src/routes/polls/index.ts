import { Elysia } from "elysia";

export const pollsRoutes = new Elysia({ prefix: "/polls" }).get(
  "/",
  () => "Hello, polls!"
);
