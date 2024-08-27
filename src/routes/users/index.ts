import Elysia, { t } from "elysia";
import { CustomError, handleError } from "../../libs/utils/error";
import {
  checkUserExists,
  createSingleUser,
} from "../../libs/drizzle/utils/users";
import { dbPool } from "../../libs/drizzle";
import { api } from "../..";
import { error } from "elysia";

export const usersRoutes = new Elysia({ prefix: "/users" })
  .error({
    CustomError,
  })
  .onError(({ code, error }) => {
    switch (code) {
      case "CustomError":
        return error.message;
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
          throw handleError(error);
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
  .post(
    "/",
    async ({ body: { email, password } }) => {
      try {
        const userExists = await api.v1.users({ email }).get();

        console.log(userExists);

        if (userExists.status !== 200) {
          return new CustomError(
            userExists.error?.status as number,
            String(
              (userExists.error?.value as { name: string; message: string })
                ?.message
            )
          );
        }

        const passwordHash = await Bun.password.hash(password, {
          algorithm: "argon2id",
          memoryCost: 2 ** 16,
          timeCost: 3,
        });

        const data = createSingleUser(dbPool, email, passwordHash);

        return data;
      } catch (err) {
        if (error instanceof Error || error instanceof CustomError) {
          handleError(error);
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
