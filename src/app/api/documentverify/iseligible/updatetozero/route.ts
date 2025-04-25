import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();


    const [result] = await db.query(
      "UPDATE users SET is_eligible = 0 WHERE email = ?",
      [email]
    );

    

    return NextResponse.json({
      result: result,
      message: "User fetched Successfully",
    });
  } catch (err: unknown) {
    return NextResponse.json({
      err: err instanceof Error ? err.message : 'Unknown error',
      message: "Error while updating user status",
    });
  }
}
