import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Resume } from "@/models/Resume";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

interface SkillGap {
  skill: string;
  missing: string;
}

interface Resume {
  skillGap?: SkillGap[];
}

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const resume = await Resume.findOne({ userEmail: email }).sort({
      createdAt: -1,
    });

    if (!resume) {
      return NextResponse.json({ message: "No resume found" }, { status: 404 });
    }

    const pdfDoc = await PDFDocument.create();
    const pageWidth = 595;
    const pageHeight = 842; // A4
    const marginTop = 40;
    const marginLeft = 40;
    const marginRight = 40;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    let y = pageHeight - marginTop;

    const drawHeader = (title: string) => {
      y -= 20;
      page.drawText(title, {
        x: marginLeft,
        y,
        size: 14,
        font: fontBold,
        color: rgb(0.2, 0.4, 0.8),
      });
      y -= 10;
      page.drawLine({
        start: { x: marginLeft, y },
        end: { x: pageWidth - marginRight, y },
        thickness: 1,
        color: rgb(0.6, 0.6, 0.6),
      });
      y -= 20;
    };

    const drawText = (text: string, indent = 0) => {
      page.drawText(text, {
        x: marginLeft + indent,
        y,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 16;
    };

    const wrapText = (text: string, maxChars: number): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let line = "";

      for (const word of words) {
        if ((line + word).length <= maxChars) {
          line += word + " ";
        } else {
          lines.push(line.trim());
          line = word + " ";
        }
      }

      if (line) lines.push(line.trim());
      return lines;
    };

    // Resume Title
    page.drawText("AI-Enhanced Resume", {
      x: marginLeft,
      y,
      size: 18,
      font: fontBold,
      color: rgb(0, 0.3, 0.6),
    });
    y -= 30;

    // Basic Info
    drawText(`Name: ${resume.name}`);
    drawText(`Email: ${resume.email}`);
    y -= 10;

    // Skills
    if (resume.skills?.length) {
      drawHeader("Skills");
      const wrappedLines = wrapText(resume.skills.join(", "), 80);
      wrappedLines.forEach((line) => {
        drawText(line, 10);
      });
      y -= 10;
    }

    // Education
    if (resume.education?.length) {
      drawHeader("Education");
      resume.education.forEach((edu: any) => {
        drawText(`${edu.year}`, 0);
        drawText(`${edu.degree}`, 20);
        drawText(`${edu.university}`, 20);
        y -= 10;
      });
    }

    // Recommended Jobs
    if (resume.recommendedJobs?.length) {
      drawHeader("Recommended Jobs");
      resume.recommendedJobs.forEach((job: any) => {
        drawText(`${job.title} - ${job.company}`, 10);
        drawText(`Skill Match: ${job.skillsMatch}%`, 20);
      });
    }

    // Skill Readiness
    if (resume.readiness?.length) {
      drawHeader("Skill Readiness");
      resume.readiness.forEach((item: any) => {
        drawText(`${item.role}: ${item.percent}%`, 10);
      });
    }

    // Skill Gaps
    if (resume.skillGap?.length) {
      drawHeader("Skill Gap");
      resume.skillGap.forEach((item: any) => {
        drawText(`${item.skill}: Missing Level ${item.missing}`, 10);
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new Response(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=improved_resume.pdf",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
