import Elysia, { t } from "elysia";
import { CustomError, handleError } from "../../libs/utils/error";
import {
  checkUserExists,
  createSingleUser,
} from "../../libs/drizzle/utils/users";
import { dbPool } from "../../libs/drizzle";

export const usersRoutes = new Elysia({ prefix: "/users" })
  .error({
    CustomError,
  })
  .onError(({ code, error }) => {
    switch (code) {
      case "CustomError":
        return error;
    }
  })
  .get(
    "/:email",
    async ({ params: { email } }) => {
      try {
        const data = await checkUserExists(dbPool, email);

        return data;
      } catch (error) {
        if (error instanceof CustomError) {
          return handleError(error);
        }
      }
    },
    {
      params: t.Object({
        email: t.String({
          format: "email",
          default: "",
          error: "Invalid email",
        }),
      }),
    }
  )
  .onError(({ code, error }) => {
    switch (code) {
      case "CustomError":
        return error;
    }
  })
  .post(
    "/",
    async ({ body: { email, passwordHash } }) => {
      try {
        const data = await createSingleUser(dbPool, email, passwordHash);

        return data;
      } catch (error) {
        if (error instanceof CustomError) {
          return handleError(error);
        }
      }
    },
    {
      body: t.Object({
        email: t.String(),
        passwordHash: t.String(),
      }),
    }
  );
