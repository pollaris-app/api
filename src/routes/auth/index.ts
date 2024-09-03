import Elysia, { t } from "elysia";
import { CustomError, handleError } from "../../libs/utils/error";
import { api } from "../..";
import {
  generatePasswordHash,
  generateVerificationCode,
  generateToken,
} from "../../libs/utils/generation";
import {
  checkIfPasswordResetExists,
  createPasswordReset,
} from "../../libs/drizzle/utils/password-resets";
import { dbPool } from "../../libs/drizzle";
import {
  checkUserExists,
  getUserIdByEmail,
} from "../../libs/drizzle/utils/users";

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
        const verificationToken = generateToken();

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
  )
  .group("/password-reset", (routes) => {
    return routes
      .post(
        "/:email",
        async ({ params: { email } }) => {
          try {
            const user = await checkUserExists(dbPool, email);

            if (!user) {
              throw new CustomError(404, "User does not exist");
            }

            const userId = await getUserIdByEmail(dbPool, email);
            const resetToken = generateToken();

            const { error: passwordResetEmailError } = await api.v1.emails[
              "password-reset"
            ].post({
              email,
              token: resetToken,
            });

            if (passwordResetEmailError) {
              throw new CustomError(
                Number(passwordResetEmailError.status),
                String(passwordResetEmailError.value.message)
              );
            }

            await createPasswordReset(dbPool, userId, resetToken);

            return {
              name: "Success",
              message: "Password reset request completed successfully",
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
      .post(
        "/:email/:token",
        async ({ params: { email, token }, body: { password } }) => {
          try {
            const user = await checkUserExists(dbPool, email);

            if (!user) {
              throw new CustomError(404, "User does not exist");
            }

            const userId = await getUserIdByEmail(dbPool, email);

            const reset = await checkIfPasswordResetExists(
              dbPool,
              userId,
              token
            );

            if (!reset) {
              throw new CustomError(404, "Reset does not exist");
            }

            const passwordHash = await generatePasswordHash(password);

            const { error: passwordUpdateError } = await api.v1.users
              .password({
                email: email,
              })
              .patch({
                passwordHash,
              });

            if (passwordUpdateError) {
              throw new CustomError(
                Number(passwordUpdateError.status),
                String(passwordUpdateError.value.message)
              );
            }

            return {
              name: "Success",
              message: "Password updated successfully",
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
            token: t.String(),
          }),
          body: t.Object({
            password: t.String(),
          }),
        }
      );
  });
