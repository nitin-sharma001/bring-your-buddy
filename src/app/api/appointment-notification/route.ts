import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const uploadDir = path.join(process.cwd(), "public", "embassy");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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

    console.log(formData);
    

    const email = formData.get("email");
    const appointment_date = formData.get("date");
    const appointment_time = formData.get("time");

    


    const [users] = (await db.query(
      "SELECT id, name, email FROM users WHERE email = ?",
      [email]
    )) as any[];

    if (!users.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];


    const saveFile = async (file: File | null, name: string) => {
          if (!file) return null;
    
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `${Date.now()}-${name}-${file.name}`;
          const filePath = path.join(uploadDir, fileName);
    
          await writeFile(filePath, buffer);
          return `/embassy/${fileName}`; 
        };

        const date_document = await saveFile(
          formData.get("date_document") as File,
          "date_document"
        );

        console.log("datedocument : ", date_document);
        


      const [prev] = await db.query("select * from reminder where user_id = ?;", [user.id])

        console.log("prev[0] : ",prev[0]);
        

        if(prev[0]?.user_id === user.id){
        const [reminders] = await db.query(
          "UPDATE reminder SET appointment_date = ?,appointment_time = ?, date_document = ? WHERE user_id = ?;",
          [appointment_date,appointment_time, date_document, user.id]
        );

        }else {
       
    const [reminders] = (await db.query(
      "INSERT into reminder (user_id, appointment_date,appointment_time, date_document) values(?, ?,?, ?);",
      [user.id, appointment_date,appointment_time, date_document]
    )) as any[];

        }


    await transporter.sendMail({
      from: `"BringUrBuddy" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Appointment Reminder - BringUrBuddy",
      html: `
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>This is a reminder for your upcoming appointment after the embassy.</p>
        <p><strong>Appointment Date:</strong> ${appointment_date} at ${appointment_time}</p>
        <p>Please ensure you are prepared and on time.</p>
        <p>Best Regards,<br><strong>BringUrBuddy Team</strong></p>
      `,
    });

    return NextResponse.json({ message: "success", data: appointment_date });
  } catch (error) {
    console.error("Error sending reminder email:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

