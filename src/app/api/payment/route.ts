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
      `UPDATE users SET payment_status = 1 WHERE email = ?`,
      [ email]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "User not found or no update made" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "success",
      data : result[0]
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}


