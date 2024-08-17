import { asc, desc, eq, ne, SQL, sql } from "drizzle-orm";
import { MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import { CustomError } from "./error";

export const operators = ["eq", "ne"] as const;

export type Operator = (typeof operators)[number];
export type Schema = MySqlTableWithColumns<any>;

export const validateOperator = (operator: string): Operator | CustomError => {
  if (!operators.includes(operator as Operator)) {
    return new CustomError(400, "Invalid operator");
  }

  return operator as Operator;
};

export const sortAndOrder = (
  schema: Schema,
  sort_by: string,
  order_by: "asc" | "desc"
) => {
  switch (order_by) {
    case "asc":
      return asc(schema[sort_by]);
    case "desc":
      return desc(schema[sort_by]);
  }
};

export const isStringField = (schema: Schema, field: string) => {
  return typeof schema[field].dataType === "string";
};

export const handleFilter = (
  schema: Schema,
  {
    field,
    operator,
    value,
  }: {
    field: string;
    operator: Operator;
    value: string;
  }
) => {
  switch (operator) {
    case "eq":
      return sql`${eq(schema[field], value)}`;
    case "ne":
      return sql`${ne(schema[field], value)}`;
  }
};

export const parseFilterString = (filter: string) => {
  let parts = filter.split(":");

  if (parts.length === 0 || parts.length > 3) {
    throw new CustomError(400, "Invalid filter string");
  }

  let field = parts[0];
  let operator = parts[1];
  let value = parts[2];

  return {
    field,
    operator,
    value,
  };
};

export const parseFilterStringArray = (filters: string[], schema: Schema) => {
  const sqlChunks: SQL[] = [];

  for (let [index, filter] of filters.entries()) {
    const { field, operator, value } = parseFilterString(filter);

    if (!(field in schema)) {
      return new CustomError(400, "Invalid filter field");
    }

    const validOperator = validateOperator(operator);

    if (validOperator instanceof CustomError) {
      return validOperator;
    }

    sqlChunks.push(
      handleFilter(schema, {
        field,
        operator: operator as Operator,
        value,
      })
    );

    if (index < filters.length - 1) {
      sqlChunks.push(sql`AND`);
    }
  }

  return sqlChunks;
};
