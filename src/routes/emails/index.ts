import Elysia, { t } from "elysia";
import {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
} from "../../libs/drizzle/utils/users";
import { CustomError, handleError } from "../../libs/utils/error";

export const emailsRoutes = new Elysia({
  prefix: "/emails",
})
  .post(
    "/email-verification",
    async ({ body: { email, token, code, userId } }) => {
      try {
        const { data } = await sendEmailVerificationEmail(
          email,
          token,
          code,
          userId
        );

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
        token: t.String(),
        code: t.String(),
        userId: t.Number(),
      }),
    }
  )
  .post(
    "/password-reset",
    async ({ body: { email, token } }) => {
      try {
        const { data } = await sendPasswordResetEmail(email, token);

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
        token: t.String(),
      }),
    }
  );
