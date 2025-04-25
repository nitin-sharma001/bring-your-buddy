import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    
    const [university] = await db.query<RowDataPacket[]>("SELECT * FROM universities where id =?", [
      id,
    ]);
    return NextResponse.json({ university: university[0] }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
