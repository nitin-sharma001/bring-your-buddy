import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { id } = await req.json();
    console.log("university id :", id);
    

    const [university] = await db.query("SELECT * FROM universities where program_id =?", [
      id,
    ]);

    console.log("university by id : ", university[0]);

    const [programs] = await db.query(
      "SELECT * FROM programs where id = ?", university[0].program_id )

    return NextResponse.json({ programs: programs }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
