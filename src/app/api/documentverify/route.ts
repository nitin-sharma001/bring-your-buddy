import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    console.log(id);
    

    const [result] = await db.query(
      "UPDATE users SET document_verified_status = 1 WHERE id = ?",
      [id]
    );

    console.log(result);
    

    return NextResponse.json({
      result: result,
      message: "User fetched Successfully",
    });
  } catch (err) {
    return NextResponse.json({
      err: err.message,
      message: "Error while updating user status",
    });
  }
}
