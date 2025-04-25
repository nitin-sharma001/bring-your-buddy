import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const userAgent = req.headers.get("user-agent") || "Unknown Device";

    const { email, password } = await req.json();

    console.log( email, password);
    

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const [users]: any[] = await db.query(
      "SELECT id, name, email, profile_img, university_id,program_id, phone_number, offer_letter_status, document_verified_status,password, is_verified FROM users WHERE email = ?",
      [email]
    );


    if (!users[0]) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = users[0];

    if (!user.is_verified) {
      return NextResponse.json(
        { error: "Please verify your email before logging in" },
        { status: 403 }
      );
    }

    // Validate password

    console.log(user);
    

    console.log(password, user.password);
    

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

  
    try {
      await transporter.sendMail({
        from: `"BringUrBuddy" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Successful Login Notification - BringUrBuddy",
        html: `
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>You have successfully logged into your account.</p>
          <p><strong>Device:</strong> ${userAgent}</p>
          <p>If this wasn't you, please reset your password immediately.</p>
          <p>Best Regards,<br><strong>BringUrBuddy Team</strong></p>
        `,
      });
    } catch (emailError) {
      console.error("Email Sending Error:", emailError);
      return NextResponse.json(
        { error: "Login successful, but failed to send email." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "success" , user : user},
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
