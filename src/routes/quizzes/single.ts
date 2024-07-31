import { Elysia, t } from "elysia";
import { dbPool } from "../../libs/drizzle";
import {
  deleteSingleQuiz,
  getSingleQuiz,
} from "../../libs/drizzle/utils/quizzes";
import { CustomError, handleError } from "../../libs/utils/error";

const validators = {
  params: t.Object({
    id: t.Number(),
  }),
};

export const quizzesSingleRoutes = new Elysia({ prefix: "/:id" })
  .get(
    "/",
    ({ params: { id } }) => {
      try {
        const data = getSingleQuiz(dbPool, Number(id));

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
    "/",
    ({ params: { id } }) => {
      try {
        const data = deleteSingleQuiz(dbPool, Number(id));

        return data;
      } catch (error) {
        if (error instanceof Error || error instanceof CustomError) {
          handleError(error);
        }
      }
    },
    validators
  );
