import { eq } from "drizzle-orm";
import { Database } from "../../../types";
import { quizzes } from "../schemas";
import { CustomError } from "../../utils/error";
import { MySqlDelete } from "drizzle-orm/mysql-core";
import { RowDataPacket } from "mysql2";

export const getAllQuizzes = async (db: Database) => {
  const data = await db.select().from(quizzes);

  if (data.length === 0) {
    throw new CustomError(404, "Quizzes not found");
  }

  return {
    name: "Success",
    message: "Quizzes found",
    data,
  };
};

export const createSingleQuiz = async (db: Database, title: string) => {
  const data = await db.insert(quizzes).values({ title });

  if (data[0].affectedRows === 0) {
    throw new CustomError(500, "Failed to create quiz");
  }

  return {
    name: "Success",
    message: "Quiz created successfully",
    data,
  };
};

export const getSingleQuiz = async (db: Database, id: number) => {
  const data = await db.select().from(quizzes).where(eq(quizzes.id, id));

  if (data.length === 0) {
    throw new CustomError(404, "Quiz not found");
  }

  return {
    name: "Success",
    message: "Quiz found",
    data,
  };
};

export const deleteSingleQuiz = async (db: Database, id: number) => {
  const data = await db.delete(quizzes).where(eq(quizzes.id, id));

  if (data[0].affectedRows === 0) {
    throw new CustomError(404, "Quiz not found");
  }

  return {
    name: "Success",
    message: "Quiz deleted successfully",
    data,
  };
};
