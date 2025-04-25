import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
  port: Number(process.env.EMAIL_PORT), // 587 for TLS, 465 for SSL
  secure: Number(process.env.EMAIL_PORT) === 465, // True for SSL, false for TLS
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email app password
  },
});

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Missing email or OTP" },
        { status: 400 }
      );
    }

    // Find user with OTP
    const [users] = (await db.query(
      "SELECT id, name, email,profile_img, phone_number, offer_letter_status, otp, otp_expires_at FROM users WHERE email = ?",
      [email]
    )) as any[];

    if (!users.length) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const user = users[0];

    console.log(user);


    console.log(user.otp);
    console.log(otp.toString());
    
    

    // Check OTP validity
    if (user.otp !== otp.toString()) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (new Date(user.otp_expires_at) < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // Mark user as verified
    await db.query("UPDATE users SET is_verified = 1 WHERE email = ?", [email]);

    // Send login confirmation email
    try {
      await transporter.sendMail({
        from: `"BringUrBuddy" <${process.env.EMAIL_USER}>`, // ✅ Fixed sender name
        to: user.email,
        subject: "Your Login Credentials - BringUrBuddy",
        html: `
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Your account has been successfully verified.</p>
          <p>Here are your login details:</p>
          <ul>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Password:</strong> (Use the password you set during registration)</li>
          </ul>
          <p>If you forgot your password, you can reset it.</p>
          <p>Best Regards,<br><strong>BringUrBuddy Team</strong></p>
        `,
      });

      return NextResponse.json({
        message:
          "success",
          user : user
      });
    } catch (emailError) {
      console.error("Email Sending Error:", emailError);
      return NextResponse.json(
        { error: "OTP verified, but failed to send email." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
