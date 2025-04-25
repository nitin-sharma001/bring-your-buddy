import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Extract email from query parameters
    const { email } = await req.json();

    console.log("Email : ",email);
    

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Fetch offer letter path from DB
    const [rows] = await db.query(
      "SELECT offer_letter FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return NextResponse.json({ offerLetters: [] });
    }

    const filePath = rows[0].offer_letter;

    // Ensure file exists
    const fullFilePath = path.join(process.cwd(), "public", filePath);
    if (!fs.existsSync(fullFilePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Return file URL
    return NextResponse.json({
      offerLetters: [{ name: path.basename(filePath), url: `${filePath}` }],
    });
  } catch (error) {
    console.error("Error fetching offer letter:", error);
    return NextResponse.json(
      { error: "Failed to fetch offer letter" , offerLetters: [] },
      { status: 500 }
    );
  }
}
