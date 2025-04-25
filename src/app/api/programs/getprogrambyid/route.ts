import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req : Request) {
  try {
    const { id } = await req.json();

    const [program] : any = await db.query("SELECT * FROM programs where id =?", [id]);
    return NextResponse.json({ program : program[0] }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
