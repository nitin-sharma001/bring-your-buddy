import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const config = {
  api: { bodyParser: false },
};


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
      return { error: "OCR API failed", isMarksheet: false };
    }

    const extractedText = result.ParsedResults[0]?.ParsedText || "";
  const isNonMedicalMarksheet =
    /physics/i.test(extractedText) &&
    /chemistry/i.test(extractedText) &&
    /\bmath(?:ematics)?\b/i.test(extractedText);




    return {
      text: extractedText,
      isNonMedicalMarksheet: isNonMedicalMarksheet,
    };
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

    const filePath = `./public${user[0].twelfth_certificate}`;

    const result = await processFile(filePath);

    return NextResponse.json(
      {
        twelfth_certificate: result,
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
