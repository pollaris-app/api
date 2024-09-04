import { eq } from "drizzle-orm";
import { Database } from "../../../types";
import { CustomError, handleError } from "../../utils/error";
import { users } from "../schemas";
import { Resend } from "resend";

export const checkUserExists = async (db: Database, email: string) => {
  const data = await db
    .select({
      email: users.email,
    })
    .from(users)
    .where(eq(users.email, email));

  return data.length > 0;
};

export const getUserIdByEmail = async (db: Database, email: string) => {
  const data = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, email));

  return data[0].id;
};

export const createSingleUser = async (
  db: Database,
  email: string,
  passwordHash: string
) => {
  const data = await db.insert(users).values({ email, passwordHash });

  if (data[0].affectedRows === 0) {
    throw new CustomError(500, "Failed to create user");
  }

  return {
    name: "Success",
    message: "User created successfully",
    data,
  };
};

export const patchEmailVerified = async (
  db: Database,
  email: string,
  value: boolean
) => {
  const data = await db
    .update(users)
    .set({ email_verified: value })
    .where(eq(users.email, email));

  if (data[0].affectedRows === 0) {
    throw new CustomError(500, "Failed to update email verification");
  }

  return {
    name: "Success",
    message: "Email verification updated successfully",
    data,
  };
};

export const patchPasswordHash = async (
  db: Database,
  email: string,
  passwordHash: string
) => {
  const data = await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.email, email));

  if (data[0].affectedRows === 0) {
    throw new CustomError(500, "Failed to update password");
  }

  return {
    name: "Success",
    message: "Password updated successfully",
    data,
  };
};

export const sendEmailVerificationEmail = async (
  email: string,
  token: string,
  code: string
) => {
  const resend = new Resend(Bun.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: `Acme <onboarding@${Bun.env.RESEND_DOMAIN}>`,
    to: [email],
    subject: "Quizzly - Account Verification",
    html: `
      <p>${code}</p>
      <a href="http://${Bun.env.HOST}/auth/email-verification/${token}">Verify</a>
    `,
  });

  if (error) {
    throw new CustomError(500, error.message);
  }

  return {
    name: "Success",
    message: "Verification email sent",
    data,
  };
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resend = new Resend(Bun.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: `Acme <onboarding@${Bun.env.RESEND_DOMAIN}>`,
    to: [email],
    subject: "Quizzly - Password Reset",
    html: `
      <a href="http://${Bun.env.HOST}/auth/password-reset/${token}">Reset</a>
    `,
  });

  if (error) {
    throw new CustomError(500, error.message);
  }

  return {
    name: "Success",
    message: "Password reset email sent",
    data,
  };
};
