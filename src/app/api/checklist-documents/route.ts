import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

// Ensure /public/uploads exists
const uploadDir = path.join(process.cwd(), "public", "check-list-documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const user_id = formData.get("user_id") as string;
console.log("user_id", user_id);
    if (!user_id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Function to handle file save
    const saveFile = async (file: File | null, name: string) => {
      if (!file) return null;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${name}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      return `/check-list-documents/${fileName}`; // Relative path to access in browser
    };

    const offer_letter = await saveFile(formData.get("offer_letter") as File, "offer");
    const admission_letter = await saveFile(formData.get("admission_letter") as File, "admission");
    const bonafied_certificate = await saveFile(formData.get("bonafide_certificate") as File, "bonafide");
    const student_undertaking_form = await saveFile(formData.get("student_undertaking_form") as File, "undertaking");

    // Save to DB
    const [result] = await db.query(
      `INSERT INTO documents (
        user_id, offer_letter, admission_letter, bonafide_certificate, student_undertaking_form
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        user_id,
        offer_letter,
        admission_letter,
        bonafied_certificate,
        student_undertaking_form,
      ]
    );

    return NextResponse.json({
      message: "Documents uploaded and saved successfully",
      suscess: true,
      result,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
