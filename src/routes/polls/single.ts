import Elysia, { t } from "elysia";
import { CustomError, handleError } from "../../libs/utils/error";
import {
  createSinglePoll,
  deleteSinglePoll,
  getSinglePoll,
} from "../../libs/drizzle/utils/polls";
import { dbPool } from "../../libs/drizzle";

export const pollsSingleRoutes = new Elysia()
  .post(
    "/",
    async ({ body: { title } }) => {
      try {
        const data = createSinglePoll(dbPool, String(title));

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
        const data = await getSinglePoll(dbPool, Number(id));

        return data;
      } catch (error) {
        if (error instanceof Error || error instanceof CustomError) {
          handleError(error);
        }
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const data = await deleteSinglePoll(dbPool, Number(id));

        return data;
      } catch (error) {
        if (error instanceof Error || error instanceof CustomError) {
          handleError(error);
        }
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
    }
  );
