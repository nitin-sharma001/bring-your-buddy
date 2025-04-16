import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"; 

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    console.log(formData);

    const email = formData.email;
    const password = formData.password;
    

    if (!email ) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err: any) {
    return NextResponse.json({
      message: "Error while updating password",
      error: err.message,
    }, { status: 500 });
  }
}
