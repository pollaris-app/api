import { asc, desc, eq, sql } from "drizzle-orm";
import { Database } from "../../../types";
import { CustomError } from "../../utils/error";
import { polls, type PollsSelect, type PollsInsert } from "../schemas";
import { parseFilterStringArray, sortAndOrder } from "../../utils/filters";

interface AllPollsQueryParams {
  sort_by: keyof PollsSelect;
  order_by: "asc" | "desc";
  limit: number;
  offset: number;
  filters: string[];
}

export const getAllPolls = async (
  db: Database,
  { sort_by, order_by, offset, limit, filters }: AllPollsQueryParams
) => {
  const sqlChunks = parseFilterStringArray(filters, polls);

  if (sqlChunks instanceof CustomError) {
    throw sqlChunks;
  }

  const data = await db
    .select()
    .from(polls)
    .orderBy(sortAndOrder(polls, sort_by, order_by))
    .limit(limit)
    .offset(offset)
    .where(filters.length > 0 ? sql.join(sqlChunks) : undefined);

  if (data.length === 0) {
    throw new CustomError(404, "Polls not found");
  }

  return {
    name: "Success",
    message: "Polls found",
    data,
  };
};

export const createSinglePoll = async (db: Database, title: string) => {
  const data = await db.insert(polls).values({ title });

  if (data[0].affectedRows === 0) {
    throw new CustomError(500, "Failed to create poll");
  }

  return {
    name: "Success",
    message: "Poll created successfully",
    data,
  };
};

export const getSinglePoll = async (db: Database, id: number) => {
  const data = await db.select().from(polls).where(eq(polls.id, id));

  if (data.length === 0) {
    throw new CustomError(404, "Poll not found");
  }

  return {
    name: "Success",
    message: "Poll found",
    data,
  };
};

export const deleteSinglePoll = async (db: Database, id: number) => {
  const data = await db.delete(polls).where(eq(polls.id, id));

  if (data[0].affectedRows === 0) {
    throw new CustomError(404, "Poll not found");
  }

  return {
    name: "Success",
    message: "Poll deleted successfully",
    data,
  };
};
