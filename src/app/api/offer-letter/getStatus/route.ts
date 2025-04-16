import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {


    const { email } = await req.json();

    const offerLetters = await db.query(
      "SELECT offer_letter_status FROM users WHERE email = ?",
      [email]
    );
    return NextResponse.json(offerLetters[0]);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch offer letters" },
      { status: 500 }
    );
  }
}
