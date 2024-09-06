import Elysia, { t } from "elysia";
import { dbPool } from "../../libs/drizzle";
import { createSession } from "../../libs/drizzle/utils/sessions";
import { generateToken } from "../../libs/utils/generation";
import { CustomError, handleError } from "../../libs/utils/error";

export const sessionsRoutes = new Elysia({
  prefix: "/sessions",
})
  .error({
    CustomError,
  })
  .onError(({ code, error }) => {
    switch (code) {
      case "CustomError":
        return error.message;
    }
  })
  .post(
    "/:userId",
    async ({ params: { userId } }) => {
      try {
        const sessionToken = generateToken();

        const { data } = await createSession(dbPool, userId, sessionToken);

        return data;
      } catch (error) {
        if (error instanceof CustomError) {
          return handleError(error);
        }
      }
    },
    {
      params: t.Object({
        userId: t.Number(),
      }),
    }
  );
