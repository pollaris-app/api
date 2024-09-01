import Elysia, { t } from "elysia";
import { CustomError, handleError } from "../../libs/utils/error";
import { api } from "../..";
import {
  generatePasswordHash,
  generateVerificationCode,
  generateVerificationToken,
} from "../../libs/utils/generation";

export const authRoutes = new Elysia({
  prefix: "/auth",
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
    "/signup",
    async ({ body: { email, password } }) => {
      try {
        const { error: emailAvailableError } = await api.v1
          .users({ email })
          .get();

        if (emailAvailableError) {
          throw new CustomError(
            Number(emailAvailableError.status),
            String(emailAvailableError.value.message)
          );
        }

        const passwordHash = await generatePasswordHash(password);
        const verificationCode = generateVerificationCode();
        const verificationToken = generateVerificationToken();

        const { error: userCreationError } = await api.v1.users.index.post({
          email,
          passwordHash,
        });

        if (userCreationError) {
          throw new CustomError(
            Number(userCreationError.status),
            String(userCreationError.value.message)
          );
        }

        const { error: emailVerificationError } = await api.v1.emails[
          "email-verification"
        ].post({
          email,
          token: verificationToken,
          code: verificationCode,
        });

        if (emailVerificationError) {
          throw new CustomError(
            Number(emailVerificationError.status),
            String(emailVerificationError.value.message)
          );
        }

        return {
          name: "Success",
          message: "Signup completed successfully",
        };
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
