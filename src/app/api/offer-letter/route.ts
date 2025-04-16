import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

  let user_email = ""

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    user_email= email;

    // Fetch student data using email
    const [rows]: any = await db.query(
      "SELECT name, id, id_proof, phone_number FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const { id, name, id_proof, phone_number } = rows[0];

    // Generate Offer Letter PDF
    const doc = new jsPDF();
    doc.text("Offer Letter", 20, 20);
    doc.text(`Dear ${name},`, 20, 40);
    doc.text(
      `We are pleased to offer you admission with ${id_proof} as ID proof.`,
      20,
      50
    );
    doc.text(`Your phone number is: ${phone_number}`, 20, 60);
    doc.text("Best Regards,", 20, 80);
    doc.text("[Your Institution Name]", 20, 90);

    // Ensure upload directory exists
    const uploadPath = path.join(process.cwd(), "public", "offerletters");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Save PDF file
    const pdfFilename = `${id}_Offer_Letter.pdf`;
    const pdfPath = path.join(uploadPath, pdfFilename);

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    fs.writeFileSync(pdfPath, pdfBuffer);

    console.log("Offer Letter saved at:", pdfPath);
    console.log("Offer Letter filename:", pdfFilename);

    const savedpath = `/offerletters/${pdfFilename}`;

    // Store offer letter filename in the database
    await db.query("UPDATE users SET offer_letter = ? WHERE id = ?", [
      savedpath,
      id,
    ]);

    // Send Email with Offer Letter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "mailto:bringmybuddy@gmail.com",
      to: email,
      subject: "Your Offer Letter",
      text: `Dear ${name},\n\nPlease find attached your offer letter.\n\nBest Regards,\n[Your Institution Name]`,
      attachments: [
        {
          filename: pdfFilename,
          path: pdfPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "Offer letter generated, saved, and sent successfully.",
      offer_letter: pdfFilename,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate, store, and send offer letter" },
      { status: 500 }
    );
  }
}

