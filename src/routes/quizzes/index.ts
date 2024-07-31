import { Elysia } from "elysia";

export const quizzesRoutes = new Elysia({ prefix: "/quizzes" }).get(
  "/",
  async () => {
    return {};
  }
);
