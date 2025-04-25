import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const config = {
  api: { bodyParser: false },
};

// Function to process a file and check if it is a marksheet
async function processFile(filePath: string) {
  try {
    const base64File = fs.readFileSync(filePath, { encoding: "base64" });

    const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        apikey: process.env.OCR_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        base64image: `data:application/pdf;base64,${base64File}`,
        isOverlayRequired: "true",
        language: "eng",
      }),
    });

    const result = await ocrResponse.json();

    if (!result || !result.ParsedResults) {
      return NextResponse.json({status:405, error: "OCR API failed", isMarksheet: false });
    }

    const extractedText = result.ParsedResults[0]?.ParsedText || "";
    const isMarksheet =
      /\b(subjects?|marks?\b(?!.*total)|percentage|grade|score|cgpa|gpa)\b/i.test(
        extractedText
      );

    return { text: extractedText, isMarksheet };

    
  } catch (error) {
    console.error("Error processing file:", error);
    return { error: "Error processing file", isMarksheet: false };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const filePath1 = `./public${user[0].tenth_certificate}`;
    const filePath2 = `./public${user[0].twelfth_certificate}`;


    const result1 = await processFile(filePath1);
    const result2 = await processFile(filePath2);

    return NextResponse.json(
      {
        tenth_certificate: result1,
        twelfth_certificate: result2,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing files:", error);
    return NextResponse.json(
      { error: "Error processing files" },
      { status: 500 }
    );
  }
}
