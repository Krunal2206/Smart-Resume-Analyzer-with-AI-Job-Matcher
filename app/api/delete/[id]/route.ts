import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { auth } from "@/lib/auth";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    await connectDB();

    const deleted = await Resume.findOneAndDelete({
      _id: id,
      userEmail: session.user.email,
    });

    if (!deleted)
      return NextResponse.json(
        { message: "Resume not found" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (err: any) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
