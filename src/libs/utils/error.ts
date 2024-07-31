import { error } from "elysia";

export class CustomError extends Error {
  constructor(public status: number = 500, public message: string) {
    super(message);
  }
}

export const handleError = (err: Error | CustomError) => {
  if (err instanceof CustomError) {
    return error(err.status, err.message);
  }

  return error(500, "Internal server error");
};
