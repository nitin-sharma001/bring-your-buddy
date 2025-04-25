import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const [countries] = await db.query("SELECT * FROM countries;");
      return NextResponse.json(countries, { status: 200 });
    } catch (error) {
      console.error("Error fetching countries:", error);
      return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 });
    }
}
  