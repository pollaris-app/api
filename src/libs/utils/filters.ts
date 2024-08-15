import { asc, desc, sql } from "drizzle-orm";
import { MySqlTableWithColumns } from "drizzle-orm/mysql-core";

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
