import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

    const [status] = await db.query(
      "Select is_eligible from users where email = ?",
      [email]
    );

    return NextResponse.json({
      status: status[0],
      message: "User fetched Successfully",
    });
  } catch (err) {
    return NextResponse.json({
      err: err,
      message: "Error while fetching User",
    });
  }
}
