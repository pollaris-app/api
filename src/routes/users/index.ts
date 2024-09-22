import Elysia, { t } from "elysia";
import { CustomError, handleError } from "../../libs/utils/error";
import {
  checkUserExists,
  createSingleUser,
  getUserByUserId,
  patchEmailVerified,
  patchPasswordHash,
} from "../../libs/drizzle/utils/users";
import { dbPool } from "../../libs/drizzle";

export const usersRoutes = new Elysia({ prefix: "/users" })

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
  .get(
    "/id/:id",
    async ({ params: { id } }) => {
      try {
        const user = await getUserByUserId(dbPool, id);

        return {
          name: "Success",
          message: "User found",
          data: user,
        };
      } catch (error) {
        if (error instanceof CustomError) {
          return handleError(error);
        }
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
    }
  )
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
    "/email-verification/:id",
    async ({ params: { id }, body: { value } }) => {
      try {
        const data = await patchEmailVerified(dbPool, id, value);

        return data;
      } catch (error) {
        if (error instanceof CustomError) {
          return handleError(error);
        }
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      body: t.Object({
        value: t.Boolean(),
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
