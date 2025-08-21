import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactFormSchema } from "@/lib/validationSchemas";
import { handleError, AppError } from "@/lib/errorHandler";
import { isRateLimited } from "@/lib/rateLimiter";

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    
    // Check rate limit
    const { limited, ttl, retryAfter } = await isRateLimited(ip, 'contact');
    if (limited) {
      return NextResponse.json(
        {
          error: {
            message: `Too many contact attempts. Please try again in ${Math.ceil(
              retryAfter || ttl / 60
            )} minute(s).`
          }
        },
        { status: 429 }
      );
    }

    const json = await req.json();

    // ✅ Validate incoming data
    const validationResult = contactFormSchema.safeParse(json);

    if (!validationResult.success) {
      throw new AppError("Validation failed", 400, "VALIDATION_ERROR");
    }

    const { name, email, message } = validationResult.data;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.CONTACT_EMAIL,
      subject: `Contact Form: ${name}`,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("EAUTH")) {
      throw new AppError("Email service configuration error", 500, "EMAIL_CONFIG_ERROR");
    }
    return handleError(error);
  }
}
