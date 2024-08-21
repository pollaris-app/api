import { Elysia, t } from "elysia";
import { createSinglePoll, getAllPolls } from "../../libs/drizzle/utils/polls";
import { dbPool } from "../../libs/drizzle";
import { CustomError, handleError } from "../../libs/utils/error";
import { pollsSingleRoutes } from "./single";

export const pollsRoutes = new Elysia({ prefix: "/polls" })
  .get(
    "/",
    async ({ query: { sort_by, order_by, limit, offset, filters } }) => {
      try {
        const data = await getAllPolls(dbPool, {
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

  .use(pollsSingleRoutes);
