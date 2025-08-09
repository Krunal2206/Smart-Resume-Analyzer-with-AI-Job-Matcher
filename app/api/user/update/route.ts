import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await connectDB();

  await User.findOneAndUpdate(
    { email: session.user.email },
    {
      name: body.name,
      preferredRole: body.preferredRole,
      preferredLocation: body.preferredLocation,
    }
  );

  return NextResponse.json({ message: "User updated" });
}
