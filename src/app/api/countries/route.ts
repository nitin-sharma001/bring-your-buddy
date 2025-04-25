import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const {id} = await req.json();
      const [countries] = await db.query("SELECT * FROM countries where id = ?", [id]);
      
      // Safely handle the countries result
      const countriesArray = Array.isArray(countries) ? countries : [];
      const country = countriesArray.length > 0 ? countriesArray[0] : null;
      
      return NextResponse.json(country, { status: 200 });
    } catch (error) {
      console.error("Error fetching country by ID:", error);
      return NextResponse.json({ error: "Failed to fetch country" }, { status: 500 });
    }
}
  