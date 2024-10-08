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

export const getEmailByUserId = async (db: Database, userId: number) => {
  const data = await db
    .select({
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, userId));

  return data[0].email;
};

export const getUserByUserId = async (db: Database, userId: number) => {
  const data = await db
    .select({
      email: users.email,
      email_verified: users.email_verified,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (data.length === 0) {
    throw new CustomError(404, "User not found");
  }

  return data[0];
};

export const checkIfUserEmailVerified = async (db: Database, email: string) => {
  const data = await db
    .select({
      email_verified: users.email_verified,
    })
    .from(users)
    .where(eq(users.email, email));

  return data[0].email_verified;
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
  userId: number,
  value: boolean
) => {
  const data = await db
    .update(users)
    .set({ email_verified: value })
    .where(eq(users.id, userId));

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

export const getPasswordHashById = async (db: Database, id: number) => {
  const data = await db
    .select({
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.id, id));

  return data[0].passwordHash;
};

export const sendEmailVerificationEmail = async (
  email: string,
  token: string,
  code: string,
  userId: number
) => {
  const resend = new Resend(Bun.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: `Acme <onboarding@${Bun.env.RESEND_DOMAIN}>`,
    to: [email],
    subject: "Quizzly - Account Verification",
    html: `
      <p>${code}</p>
      <a href="http://${Bun.env.DOMAIN}/auth/email-verification/${userId}/${token}">Verify</a>
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

export const sendPasswordResetEmail = async (
  email: string,
  userId: number,
  token: string
) => {
  const resend = new Resend(Bun.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: `Acme <onboarding@${Bun.env.RESEND_DOMAIN}>`,
    to: [email],
    subject: "Quizzly - Password Reset",
    html: `
      <a href="http://${Bun.env.DOMAIN}/auth/password-reset/${userId}/${token}">Reset</a>
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
