import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { id } = await req.json();
    console.log("university id :", id);
    

    const [university] = await db.query("SELECT * FROM universities where university_country_id =?", [
      id,
    ]);
    return NextResponse.json({ university: university }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
