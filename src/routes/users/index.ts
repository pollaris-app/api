import Elysia, { t } from "elysia";
import { CustomError, handleError } from "../../libs/utils/error";
import {
  checkUserExists,
  createSingleUser,
} from "../../libs/drizzle/utils/users";
import { dbPool } from "../../libs/drizzle";
import { api } from "../..";

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
        return error.message;
    }
  })
  .post(
    "/",
    async ({ body: { email, password } }) => {
      try {
        const { error } = await api.v1.users({ email }).get();

        if (error) {
          throw new CustomError(
            Number(error.status),
            String(error.value.message)
          );
        }

        const passwordHash = await Bun.password.hash(password, {
          algorithm: "argon2id",
          memoryCost: 2 ** 16,
          timeCost: 3,
        });

        const data = createSingleUser(dbPool, email, passwordHash);

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
        password: t.String(),
      }),
    }
  );
