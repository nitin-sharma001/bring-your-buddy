import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Fetch universities based on program ID
export async function POST(req: Request) {
  const { programId  } = await req.json();

  console.log(programId);
  

  if (!programId) {
    return NextResponse.json({ error: "Program ID is required" }, { status: 400 });
  }

  try {
    const [universities] = await db.query("SELECT * FROM universities WHERE program_id = ?", [programId]);
    return NextResponse.json({ universities }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET() {


  try {
    const [universities] = await db.query(
      "SELECT * FROM universities"
      
    );
    return NextResponse.json({ universities }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
