import { Elysia } from "elysia";
import { quizzesRoutes } from "./routes/quizzes";
import { pollsRoutes } from "./routes/polls";

const app = new Elysia({ prefix: "/api/v1" })
  .use(quizzesRoutes)
  .use(pollsRoutes)
  .listen(3000);
