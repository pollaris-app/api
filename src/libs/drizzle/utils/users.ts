import { eq } from "drizzle-orm";
import { Database } from "../../../types";
import { CustomError, handleError } from "../../utils/error";
import { users } from "../schemas";

export const checkUserExists = async (db: Database, email: string) => {
  try {
    const data = await db.select().from(users).where(eq(users.email, email));

    if (data.length > 0) {
      throw new CustomError(409, "Email is already in use");
    }

    return {
      name: "Success",
      message: "Email is available",
      data,
    };
  } catch (error) {
    if (error instanceof CustomError) {
      throw new CustomError(error.status, error.message);
    }
  }
};

export const createSingleUser = async (
  db: Database,
  email: string,
  passwordHash: string
) => {
  const data = await db.insert(users).values({ email, passwordHash });

  if (data[0].affectedRows === 0) {
    return new CustomError(500, "Failed to create user");
  }

  return {
    name: "Success",
    message: "User created successfully",
    data,
  };
};
