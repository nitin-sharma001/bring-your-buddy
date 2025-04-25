import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import nodemailer from "nodemailer";

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const saveFile = async (file: File) => {
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
};

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
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone_number = formData.get("phone_number") as string;
    const country_id = Number(formData.get("country_id"));
    const university_country = formData.get("university_country") as string;
    const program_id = Number(formData.get("program_id"));
    const university_id = Number(formData.get("university_id"));
    const course_type_id = Number(formData.get("course_type_id"));
    const course_trade_id = Number(formData.get("course_trade_id"));

    const requiredFiles = [
      "tenth_certificate",
      "twelfth_certificate",
      "bachelor_certificate",
      "id_proof",
    ];



    const filePaths: { [key: string]: string } = {};

    for (const fileKey of requiredFiles) {
      const file = formData.get(fileKey) as File | null;

      console.log(file, fileKey);

      // if (fileKey == "bachelor_certificate") {
      //   continue;
      // }

      if(file == null) {
        continue;
      }
      
      // if (!file) {
      //   return NextResponse.json(
      //     { error: `${fileKey} is required` },
      //     { status: 400 }
      //   );
      // }
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json(
          { error: `${fileKey} must be a PDF` },
          { status: 400 }
        );
      }
      filePaths[fileKey] = await saveFile(file);
    }

    console.log(course_trade_id, "course_trade_id");
    

    let paths: string[] = [];
    for (let i = 0; ; i++) {
      const file = formData.get(`other_certificate[${i}]`) as File | null;
      if (!file) break;
      const filePath = await saveFile(file);
      paths.push(filePath);
    }
    const otherPaths = paths.length > 0 ? paths.join(" ") : null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    console.log(
      "tenth_certificate : ",
      filePaths.tenth_certificate,
      "twelfth_certificate : ",
      filePaths.twelfth_certificate,
      "bachelor_certificate : ",
      filePaths.bachelor_certificate,
      "other_certificate : ",

      otherPaths
    );

    await db.query(
      `INSERT INTO users (
        name, email, password, phone_number, country_id,university_country,
        course_type_id, course_trade_id, program_id, university_id,
        id_proof, otp, otp_expires_at,
        tenth_certificate, twelfth_certificate,bachelor_certificate, other_certificate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?);`,
      [
        name,
        email,
        hashedPassword,
        phone_number,
        country_id,
        university_country,
        course_type_id,
        course_trade_id,
        program_id,
        university_id,
        filePaths.id_proof,
        otp,
        otpExpiry,
        filePaths.tenth_certificate,
        filePaths.twelfth_certificate,
        filePaths.bachelor_certificate,
        otherPaths,
      ]
    );

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for Registration",
        html: `
          <p>Dear <strong>${name}</strong>,</p>
          <p>Your OTP for registration is: <strong>${otp}</strong></p>
          <p>This OTP is valid for 10 minutes.</p>
          <p>Best Regards,<br><strong>BringUrBuddy Team</strong></p>
        `,
      });
    } catch (emailError) {
      console.error("Email Sending Error:", emailError);
      return NextResponse.json(
        { error: "User registered but failed to send OTP email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
