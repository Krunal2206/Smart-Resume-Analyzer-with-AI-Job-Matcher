import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleError(error: unknown) {
  console.error("Error:", error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        message: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: error.errors,
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "An unexpected error occurred",
    },
    { status: 500 }
  );
}
