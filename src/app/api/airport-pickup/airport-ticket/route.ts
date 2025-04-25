import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const uploadDir = path.join(process.cwd(), "public", "airport-images");
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
    const departure_datetime = formData.get("departure_datetime");
    const departure_port = formData.get("departure_port");
    const destination_port = formData.get("destination_port");
    const destination_datetime = formData.get("destination_datetime");
    const ticket_document = formData.get("ticket_document");

    


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
          return `/airport-images/${fileName}`; 
        };

        const resultdocument = await saveFile(
          formData.get("ticket_document") as File,
          "ticket_document"
        );

        console.log("ticket_document : ", resultdocument);
        

    



     const [prev] = await db.query("select * from airport_pickup where user_id = ?" , [user.id])

        console.log("prev[0] : ",prev[0]);
        

        if(prev[0]?.user_id === user.id){
        const [reminders] = await db.query(
          "UPDATE tickets SET departure_datetime = ?, departure_port = ?, destination_port = ?, destination_datetime = ?, ticket_document = ? WHERE user_id = ?;",
          [departure_datetime,
        departure_port,
        destination_port,
        destination_datetime,
        resultdocument
        , user.id]
        );

        }else {
       
      const [reminders] = (await db.query(
      "INSERT into tickets (user_id, departure_datetime, departure_port, destination_port, destination_datetime, ticket_document) values(?, ?,?,?,?,?);",
      [
        user.id,
        departure_datetime,
        departure_port,
        destination_port,
        destination_datetime,
        resultdocument,
      ]
    )) as any[];


        }


    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: "jatinofjmit@gmail.com",
        subject: "Airport Pickup Photo Document",
        html: `
            <p>Dear <strong>Agent</strong>,</p>
            <p>The photo document for user <strong>${user.name}</strong> has been uploaded.</p>
            <p>See the attached file.</p>
            <p>Best Regards,<br><strong>BringUrBuddy Team</strong></p>
        `,
        attachments: [
          {
            filename: path.basename(resultdocument!), 
            path: path.join(process.cwd(), "public", resultdocument!), 
          },
        ],
      });

    } catch (emailError) {
      console.error("Email Sending Error:", emailError);
      return NextResponse.json(
        { error: "User registered but failed to send OTP email." },
        { status: 500 }
      );
    }


    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.error("Error sending reminder email:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

