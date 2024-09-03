import Elysia, { t } from "elysia";
import { CustomError, handleError } from "../../libs/utils/error";
import {
  checkUserExists,
  createSingleUser,
  patchPasswordHash,
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
        const userExists = await checkUserExists(dbPool, email);

        if (userExists) {
          throw new CustomError(409, "Email is already in use");
        }

        return {
          name: "Success",
          message: "Email is available",
        };
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
  )
  .patch(
    "/password/:email",
    async ({ params: { email }, body: { passwordHash } }) => {
      try {
        const data = await patchPasswordHash(dbPool, email, passwordHash);

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
      body: t.Object({
        passwordHash: t.String(),
      }),
    }
  );
