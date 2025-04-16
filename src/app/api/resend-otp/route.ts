import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // Check if the email exists in the database
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    console.log(users);
    


    // Store OTP in DB
    await db.query("UPDATE users SET otp = ?, otp_expires_at = ? WHERE email = ?", [
      otp,
      otpExpiresAt,
      email,
    ]);

    // Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP Email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your OTP Code - BringUrBuddy",
      html: `
        <p>Dear User,</p>
        <p>Your OTP code is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
        <p>Best Regards,<br><strong>BringUrBuddy Team</strong></p>
      `,
    });

    return NextResponse.json({ message: "success" });

  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}