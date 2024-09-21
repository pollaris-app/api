import { and, eq } from "drizzle-orm";
import { Database } from "../../../types";
import { emailVerifications } from "../schemas";
import { CustomError } from "../../utils/error";

export const checkIfEmailVerificationExists = async (
  db: Database,
  token: string,
  code: string
) => {
  const verification = await db
    .select({
      token: emailVerifications.token,
      code: emailVerifications.code,
    })
    .from(emailVerifications)
    .where(
      and(
        eq(emailVerifications.token, token),
        eq(emailVerifications.code, code)
      )
    );

  return verification.length > 0;
};

export const checkIfEmailVerificationExistsByUserId = async (
  db: Database,
  userId: number
) => {
  const verification = await db
    .select({
      userId: emailVerifications.userId,
    })
    .from(emailVerifications)
    .where(eq(emailVerifications.userId, userId));

  return verification.length > 0;
};

export const validateEmailVerification = async (
  db: Database,
  userId: number,
  token: string,
  code: string
) => {
  const verification = await db
    .select({
      userId: emailVerifications.userId,
      token: emailVerifications.token,
    })
    .from(emailVerifications)
    .where(
      and(
        eq(emailVerifications.userId, userId),
        eq(emailVerifications.token, token),
        eq(emailVerifications.code, code)
      )
    );

  return verification.length > 0;
};

export const createEmailVerification = async (
  db: Database,
  userId: number,
  token: string,
  code: string
) => {
  const data = await db
    .insert(emailVerifications)
    .values({ userId, token, code, expiresAt: new Date() });

  if (data[0].affectedRows === 0) {
    throw new CustomError(500, "Failed to create email verification");
  }

  return {
    name: "Success",
    message: "Email verification created successfully",
    data,
  };
};

export const removeEmailVerificationsForUser = async (
  db: Database,
  userId: number
) => {
  const data = await db
    .delete(emailVerifications)
    .where(eq(emailVerifications.userId, userId));

  if (data[0].affectedRows === 0) {
    throw new CustomError(404, "Email verification not found");
  }

  return {
    name: "Success",
    message: "Email verification removed successfully",
  };
};

export const getUserIdByEmailVerificationToken = async (
  db: Database,
  token: string
) => {
  const data = await db
    .select({ userId: emailVerifications.userId })
    .from(emailVerifications)
    .where(eq(emailVerifications.token, token));

  if (data.length === 0) {
    throw new CustomError(404, "Email verification not found");
  }

  return data[0].userId;
};
