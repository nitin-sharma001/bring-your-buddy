import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({ 
        message: "User ID is required", 
        success: false 
      }, { status: 400 });
    }

    const [documents] = await db.query(
      "SELECT * FROM visa WHERE user_id = ?",
      [user_id]
    );

    const documentArray = Array.isArray(documents) ? documents : [];
    
    return NextResponse.json({
      message: documentArray.length > 0 ? "Documents found" : "No documents found",
      success: true,
      documents: documentArray.length > 0 ? documentArray[0] : null
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ 
      message: "Internal Server Error", 
      error: err.message,
      success: false 
    }, { status: 500 });
  }
} 