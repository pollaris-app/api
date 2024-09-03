import { and, eq } from "drizzle-orm";
import { Database } from "../../../types";
import { passwordResets, users } from "../schemas";
import { CustomError } from "../../utils/error";

export const checkIfPasswordResetExists = async (
  db: Database,
  id: number,
  token: string
) => {
  const reset = await db
    .select({
      userId: passwordResets.userId,
      token: passwordResets.token,
    })
    .from(passwordResets)
    .where(and(eq(passwordResets.userId, id), eq(passwordResets.token, token)));

  return reset.length > 0;
};

export const createPasswordReset = async (
  db: Database,
  userId: number,
  token: string
) => {
  const data = await db
    .insert(passwordResets)
    .values({ userId, token, expiresAt: new Date() });

  if (data[0].affectedRows === 0) {
    throw new CustomError(500, "Failed to create password reset");
  }

  return {
    name: "Success",
    message: "Password reset created successfully",
    data,
  };
};
