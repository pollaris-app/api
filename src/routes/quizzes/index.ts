import { Elysia, t } from "elysia";
import {
  createSingleQuiz,
  getAllQuizzes,
} from "../../libs/drizzle/utils/quizzes";
import { dbPool } from "../../libs/drizzle";
import { quizzesSingleRoutes } from "./single";
import { CustomError, handleError } from "../../libs/utils/error";

export const quizzesRoutes = new Elysia({ prefix: "/quizzes" })
  .post(
    "/",
    ({ body: { title } }) => {
      try {
        const data = createSingleQuiz(dbPool, title);

        return data;
      } catch (error) {
        if (error instanceof Error || error instanceof CustomError) {
          handleError(error);
        }
      }
    },
    {
      body: t.Object({
        title: t.String(),
      }),
    }
  )
  .get("/", async () => {
    try {
      const data = await getAllQuizzes(dbPool);

      return data;
    } catch (error) {
      if (error instanceof Error || error instanceof CustomError) {
        handleError(error);
      }
    }
  })
  .use(quizzesSingleRoutes);
