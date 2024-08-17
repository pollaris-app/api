import { eq, SQL, sql } from "drizzle-orm";
import { Database } from "../../../types";
import { quizzes, QuizzesSelect } from "../schemas";
import { CustomError } from "../../utils/error";
import {
  handleFilter,
  type Operator,
  operators,
  parseFilterString,
  parseFilterStringArray,
  sortAndOrder,
  validateOperator,
} from "../../utils/filters";

interface AllQuizzesQueryParams {
  sort_by: keyof QuizzesSelect;
  order_by: "asc" | "desc";
  limit: number;
  offset: number;
  filters: string[];
}

// TODO: Try catch block for error handling
export const getAllQuizzes = async (
  db: Database,
  { sort_by, order_by, offset, limit, filters }: AllQuizzesQueryParams
) => {
  const sqlChunks = parseFilterStringArray(filters, quizzes);

  if (sqlChunks instanceof CustomError) {
    throw sqlChunks;
  }

  const data = await db
    .select()
    .from(quizzes)
    .orderBy(sortAndOrder(quizzes, sort_by, order_by))
    .limit(limit)
    .offset(offset)
    .where(filters.length > 0 ? sql.join(sqlChunks) : undefined);

  if (data.length === 0) {
    return new CustomError(404, "Quizzes not found");
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
    return new CustomError(500, "Failed to create quiz");
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
    return new CustomError(404, "Quiz not found");
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
    return new CustomError(404, "Quiz not found");
  }

  return {
    name: "Success",
    message: "Quiz deleted successfully",
    data,
  };
};
