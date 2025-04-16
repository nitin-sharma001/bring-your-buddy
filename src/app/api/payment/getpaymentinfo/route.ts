import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email  are required" },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `select payment_status from users where email = ?`,
      [ email]
    );


    return NextResponse.json({
      message: "success",
      data : result[0]
    });
  } catch (error) {
    console.error("Error getting payment info:", error);
    return NextResponse.json(
      { error: "Failed " },
      { status: 500 }
    );
  }
}


