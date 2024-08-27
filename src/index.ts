import { Elysia } from "elysia";
import { quizzesRoutes } from "./routes/quizzes";
import { pollsRoutes } from "./routes/polls";
import { usersRoutes } from "./routes/users";
import { treaty } from "@elysiajs/eden";

const app = new Elysia({ prefix: "/api/v1" })
  .use(quizzesRoutes)
  .use(pollsRoutes)
  .use(usersRoutes)
  .listen(3000);

export type App = typeof app;
export const { api } = treaty<App>(Bun.env.HOST ?? "localhost:3000");
