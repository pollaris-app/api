import { Elysia, t } from "elysia";
import { dbPool } from "../../libs/drizzle";
import {
  createSingleQuiz,
  deleteSingleQuiz,
  getSingleQuiz,
} from "../../libs/drizzle/utils/quizzes";
import { CustomError, handleError } from "../../libs/utils/error";

const validators = {
  params: t.Object({
    id: t.Number(),
  }),
};

export const quizzesSingleRoutes = new Elysia()
  .post(
    "/",
    async ({ body: { title } }) => {
      try {
        const data = await createSingleQuiz(dbPool, title);

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
  .get(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const data = await getSingleQuiz(dbPool, Number(id));

        return data;
      } catch (error) {
        if (error instanceof Error || error instanceof CustomError) {
          handleError(error);
        }
      }
    },
    validators
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const data = await deleteSingleQuiz(dbPool, Number(id));

        return data;
      } catch (error) {
        if (error instanceof Error || error instanceof CustomError) {
          handleError(error);
        }
      }
    },
    validators
  );
