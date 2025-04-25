import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  try {
    const { embassy_email, email } = await req.json();

    console.log("embassy_email : ", embassy_email);

    const [users] = await db.query<RowDataPacket[]>("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (!users.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    console.log("user : ", user);

    const [country_id] = await db.query<RowDataPacket[]>(
      "SELECT * FROM countries WHERE id = ?",
      [user.country_id]
    );

    const [university_country] = await db.query<RowDataPacket[]>(
      "SELECT * FROM countries WHERE id = ?",
      [user.university_country]
    );

    const [university_id] = await db.query<RowDataPacket[]>(
      "SELECT * FROM universities WHERE id = ?",
      [user.university_id]
    );

    const [program_id] = await db.query<RowDataPacket[]>(
      "SELECT * FROM universities WHERE id = ?",
      [user.program_id]
    );

    const [prev] = await db.query<RowDataPacket[]>("select * from embassy where user_id = ?", [
      user.id,
    ]);

    console.log("prev[0] : ", prev[0]);

    if (prev[0]?.user_id === user.id) {
      const [reminders] = await db.query<RowDataPacket[]>(
        "UPDATE embassy SET embassy_email = ? WHERE user_id = ?;",
        [embassy_email, user.id]
      );
    } else {
      const [reminders] = await db.query<RowDataPacket[]>(
        "INSERT INTO embassy (embassy_email, user_id) VALUES (?, ?);",
        [embassy_email, user.id]
      );
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

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Confiramtion about Student Admitted",
        html: `
                  <p>Dear <strong>To</p>
                    <p>The Embassador, </p>
                    <p>High Commission of ${university_country[0]?.name},</p>
                    <p>${country_id[0]?.name}.</p>

                    <p>Respected Sir;</p>
                    </strong>,</p>
                    <p>${university_id[0]?.name} is the fastest emerging prestigious education group of ${university_id[0].campus} - ${university_id[0].description}</p>

                    <p>There are 09 professional Institutions situated in a Single sprawling campus, offering array of programs including Diploma, Undergraduate and Postgraduate Programs in following disciplines:</p>
                    
                    <ul>
                      <li>Engineering</li>
                      <li>Management</li>
                      <li>Pharmaceutical</li>
                      <li>Computer Applications &amp; IT</li>
                      <li>Sciences</li>
                      <li>Polytechnic</li>
                      <li>Hospitality &amp; Tourism Management</li>
                      <li>Paramedical</li>
                      <li>Education</li>
                      <li>Law</li>
                      <li>Agriculture</li>
                      <li>Commerce</li>
                    </ul>

                    <p>All above programs are fully accredited and recognized by the respective regulatory bodies mentioned below:</p>

                    <ul>
                      <li>AICTE - All India Council of Technical Education, New Delhi</li>
                      <li>PCI - Pharmacy Council of India, New Delhi</li>
                      <li>BCI - Bar Council of India, New Delhi</li>
                      <li>NCTE - National Council of Teacher Education (India)</li>
                      <li>Punjab State Government</li>
                      <li>IKG - Punjab Technical University, Jalandhar, Punjab, India</li>
                      <li>MRS - Punjab Technical University, Bathinda, Punjab, India</li>
                      <li>Punjabi University, Patiala, Punjab, India</li>
                      <li>PSBTE - Punjab State Board of Technical Education, Chandigarh, India</li>
                    </ul>

                    <p>With Due Respect, we take this opportunity to bring to your kind notice that  </p>
                    <p>This is to certify that, ${user.name}, his Passport No./ID P11121703 has been admitted in ${university_id[0]?.name}, ${university_id[0]?.location} has approved by AICTE/PCI/BCI,  in ${program_id[0]?.name}. </p>
                    <p>We have issued him the Offer Letter Vide Ref.No SVGOI/DIA/25/4851 on Dated: 17/03/2025, and Acceptance Letter Vide Ref.No. SVGOI/DIA/25/4859 on Dated 18/03/2025 and his ERP Registration No. 1242101178. He will stay in our Boys Hostel.</p>
                    <p><strong>Student has paid his/her Registration fees and his/her admission has been confirmed</p></strong>
                    <p><strong>Please consider the student for Student Study Visa so that he/she can start his study in India</p></strong>
                  `,
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
