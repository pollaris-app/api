import { asc, desc, sql } from "drizzle-orm";
import { MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import { CustomError } from "./error";

export type Operator = "eq";
export type Schema = MySqlTableWithColumns<any>;

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
      return sql`${schema[field]} = ${
        isStringField(schema, field) ? sql`${value}` : sql`${value}`
      }`;
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
