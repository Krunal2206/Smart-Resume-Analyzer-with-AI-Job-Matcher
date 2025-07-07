import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactFormSchema } from "@/lib/contactSchema";

export async function POST(req: Request) {
  try {
    const json = await req.json();

    // ✅ Validate incoming data
    const result = contactFormSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, message } = result.data;

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
    console.error("Mail Error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
