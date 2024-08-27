import { error } from "elysia";

export class CustomError extends Error {
  constructor(public status = 500, public message: string) {
    super(message);
  }
}

export const handleError = (err: CustomError | Error) => {
  if (err instanceof CustomError) {
    return error(err.status, {
      name: err.name,
      message: err.message,
    });
  }

  return error(500, {
    name: err.name,
    message: err.message,
  });
};
