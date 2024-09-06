import { Database } from "../../../types";
import { CustomError } from "../../utils/error";
import { sessions } from "../schemas";

export const createSession = async (
  db: Database,
  userId: number,
  token: string
) => {
  const data = await db
    .insert(sessions)
    .values({ userId, token, expiresAt: new Date() });

  if (data[0].affectedRows === 0) {
    throw new CustomError(500, "Failed to create session");
  }

  return {
    name: "Success",
    message: "Session created successfully",
    data,
  };
};
