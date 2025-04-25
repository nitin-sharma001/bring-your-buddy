import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // Extract program_id from query params
    // const { searchParams } = new URL(req.url);
    // const programId = searchParams.get("program_id");

    const {id} =await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Program ID is required" },
        { status: 400 }
      );
    }

    const [trades]: any[] = await db.query(
      "SELECT * FROM course_trades WHERE program_id = ?",
      [id]
    );

    if (!trades || trades.length === 0) {
      return NextResponse.json(
        { message: "No trades found for this program" },
        { status: 404 }
      );
    }

    return NextResponse.json({ trades }, { status: 200 });
  } catch (error) {
    console.error("Error fetching course trades:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
