import { and, eq } from "drizzle-orm";
import { Database } from "../../../types";
import { emailVerifications } from "../schemas";
import { CustomError } from "../../utils/error";

export const checkIfEmailVerificationExists = async (
  db: Database,
  userId: number,
  token: string,
  code: string
) => {
  const verification = await db
    .select({
      userId: emailVerifications.userId,
      token: emailVerifications.token,
      code: emailVerifications.code,
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
