import { Elysia } from "elysia";
import { treaty } from "@elysiajs/eden";

import { quizzesRoutes } from "./routes/quizzes";
import { pollsRoutes } from "./routes/polls";
import { usersRoutes } from "./routes/users";
import { authRoutes } from "./routes/auth";
import { emailsRoutes } from "./routes/emails";
import { sessionsRoutes } from "./routes/sessions";

const app = new Elysia({ prefix: "/api/v1" })
  .use(authRoutes)
  .use(emailsRoutes)
  .use(usersRoutes)
  .use(quizzesRoutes)
  .use(pollsRoutes)
  .use(sessionsRoutes)
  .listen(3000);

export type App = typeof app;
export const { api } = treaty<App>(Bun.env.HOST ?? "localhost:3000");
