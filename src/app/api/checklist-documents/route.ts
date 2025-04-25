


import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import nodemailer from "nodemailer";

// Ensure /public/check-list-documents exists
const uploadDir = path.join(process.cwd(), "public", "check-list-documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// SMTP Email Configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const user_id = formData.get("user_id") as string;

    if (!user_id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Function to handle file save
    const saveFile = async (file: File, name: string) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${name}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      return `/check-list-documents/${fileName}`; // Relative path
    };

    // List of all file fields
    const fileFields = [
      "offer_letter",
      "admission_letter",
      "bonafide_certificate",
      "student_undertaking_form",
      "offer_letter_school",
      "photograph",
      "parent_affidavit",
      "proof_of_residence",
      "receipt_of_paid_fees",
      "itinerary_ticket",
      "bank_statement",
      "bank_statement_owner_id",
      "passport_copy",
      "educational_certificates",
      "id_copy",
    ];

    const uploadedFiles: { [key: string]: string } = {};

    // Save only uploaded files
    for (const field of fileFields) {
      const file = formData.get(field) as File | null;
      if (file && file.name) {
        const savedPath = await saveFile(file, field);
        if (savedPath) {
          uploadedFiles[field] = savedPath;
        }
      }
    }

    // Get user and document info
    const [existingDocs] = await db.query("SELECT * FROM documents WHERE user_id = ?", [user_id]);
    const [usertable] = await db.query("SELECT * FROM users WHERE id = ?", [user_id]);
    const email = usertable[0].email;

    let result;

    if (Array.isArray(existingDocs) && existingDocs.length > 0) {
      // Update only fields that were uploaded
      if (Object.keys(uploadedFiles).length > 0) {
        const updateFields = Object.keys(uploadedFiles)
          .map((key) => `${key} = ?`)
          .join(", ");

        const values = Object.values(uploadedFiles);
        const updateQuery = `UPDATE documents SET ${updateFields}, updated_at = NOW() WHERE user_id = ?`;

        [result] = await db.query(updateQuery, [...values, user_id]);
      }
    } else {
      // Insert new record
      const insertFields = ["user_id", ...Object.keys(uploadedFiles)];
      const insertValues = [user_id, ...Object.values(uploadedFiles)];
      const placeholders = insertFields.map(() => "?").join(", ");

      const query = `INSERT INTO documents (${insertFields.join(", ")}) VALUES (${placeholders})`;
      [result] = await db.query(query, insertValues);
    }

    // Prepare email attachments (only newly uploaded)
    const attachments = Object.entries(uploadedFiles).map(([key, relativePath]) => {
      const fullPath = path.join(process.cwd(), "public", relativePath.replace("/check-list-documents/", "check-list-documents/"));
      return {
        filename: `${key.replace(/_/g, " ")}.${fullPath.split('.').pop()}`,
        path: fullPath, // full path needed for Nodemailer
      };
    });
    

    const mailOptions = {
      from: `"BringUrBuddy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Bring Ur Buddy - Your Documents",
      text: `Hello ${email},\n\nPlease find attached your uploaded documents.\n\nBest regards,\nBring Ur Buddy Team`,
      attachments,
    };

    if (attachments.length > 0) {
      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({
      message: "Documents uploaded and emailed successfully",
      success: true,
      result,
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}
