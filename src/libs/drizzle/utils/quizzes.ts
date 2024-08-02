import { asc, desc, eq } from "drizzle-orm";
import { Database } from "../../../types";
import { quizzes, QuizzesSelect } from "../schemas";
import { CustomError } from "../../utils/error";

interface AllQuizzesQueryParams {
  sort_by: keyof QuizzesSelect;
  order_by: "asc" | "desc";
  limit: number;
  offset: number;
}

export const getAllQuizzes = async (
  db: Database,
  { sort_by, order_by, offset, limit }: AllQuizzesQueryParams
) => {
  const sortAndOrder = () => {
    switch (order_by) {
      case "asc":
        return asc(quizzes[sort_by]);
      case "desc":
        return desc(quizzes[sort_by]);
    }
  };

  const data = await db
    .select()
    .from(quizzes)
    .orderBy(sortAndOrder())
    .limit(limit)
    .offset(offset);

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
