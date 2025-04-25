import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const uploadDir = path.join(process.cwd(), "public", "embassy", "visa-result");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    console.log(formData);
    


    const email = formData.get("email");
    const visa_decision_letter = formData.get("visa_result_document");

    console.log("visa_decision_letter : ", visa_decision_letter);
    console.log("email : ", email);
    
  
    


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
          return `/embassy/visa-result/${fileName}`; 
        };

        const resultdocument = await saveFile(visa_decision_letter,
          "visa_decision_letter"
        );

        console.log("visa_document : ", resultdocument);
        console.log("user.id : ", user.id);


        const [prev] = await db.query("select * from visa where user_id = ?" , [user.id])

        console.log("prev[0] : ",prev[0]);
        

        if(prev[0]?.user_id === user.id){
        const [reminders] = await db.query(
          "UPDATE visa SET visa_decision_letter = ? WHERE user_id = ?;",
          [resultdocument, user.id]
        );

        }else {
        const [reminders] = await db.query(
          "INSERT INTO visa (visa_decision_letter, user_id) VALUES (?, ?);",
          [resultdocument, user.id]
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

