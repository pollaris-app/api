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
  .get(
    "/",
    async ({ query: { sort_by, order_by, limit, offset, filters } }) => {
      try {
        const data = await getAllQuizzes(dbPool, {
          sort_by: sort_by ?? "id",
          order_by: order_by ?? "asc",
          limit: limit ?? 20,
          offset: offset ?? 0,
          filters: filters ?? [],
        });

        return data;
      } catch (error) {
        if (error instanceof Error || error instanceof CustomError) {
          handleError(error);
        }
      }
    },
    {
      query: t.Object({
        sort_by: t.Optional(
          t.Enum({
            id: "id",
            title: "title",
          })
        ),
        order_by: t.Optional(
          t.Enum({
            asc: "asc",
            desc: "desc",
          })
        ),
        limit: t.Optional(t.Number()),
        offset: t.Optional(t.Number()),
        filters: t.Optional(t.Array(t.String())),
      }),
    }
  )
  .use(quizzesSingleRoutes);
