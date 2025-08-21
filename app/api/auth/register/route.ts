import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rateLimiter";
import { registerSchema } from "@/lib/validationSchemas";
import { handleError, AppError } from "@/lib/errorHandler";

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";

    // Check rate limit based on IP
    const { limited, ttl, retryAfter } = await isRateLimited(ip, "register");
    if (limited) {
      return NextResponse.json(
        {
          message: `Too many registration attempts. Please try again in ${Math.ceil(
            retryAfter || ttl / 60
          )} minute(s).`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new AppError(
        "Validation failed: " +
          errorMessages.map((e) => `${e.field}: ${e.message}`).join(", "),
        400,
        "VALIDATION_ERROR"
      );
    }

    const { name, email, password } = validationResult.data;

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError(
        "User already exists with this email",
        400,
        "USER_EXISTS"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
    });

    return NextResponse.json(
      { message: "User registered successfully!", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
