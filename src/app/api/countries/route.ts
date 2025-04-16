import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
      const {id} = await req.json();
      const [countries] = await db.query("SELECT * FROM countries where id = ?", [id]);
      return NextResponse.json(countries, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  