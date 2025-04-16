import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const id = formData.get("id");
    const name = formData.get("name");
    const email = formData.get("email");
    const phone_number = formData.get("phone_number");
    const program_id = formData.get("program_id");
    const university_id = formData.get("university_id");

    if (
      !id ||
      !name ||
      !email ||
      !phone_number ||
      !university_id ||
      !program_id
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
  const uploadDir = "./public/uploads/";

  await fs.mkdir(uploadDir, { recursive: true });

  const saveFile = async (file) => {
    if (!file) return null;
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name.replace(/\s+/g, "_")}`;

    const filePath = path.join(uploadDir, fileName); // Fix filePath usage
    await fs.writeFile(filePath, buffer);

    return `/uploads/${fileName}`; 
  };


    const tenth_certificate = await saveFile(formData.get("tenth_certificate"));
    const twelfth_certificate = await saveFile(
      formData.get("twelfth_certificate")
    );
    const bachelor_certificate = await saveFile(
      formData.get("bachelor_certificate")
    );

    console.log("tenth_certificate : ", tenth_certificate);
    console.log("twelfth_certificate : ", twelfth_certificate);
    
    await db.query(
      "UPDATE users SET name=?, email=?, phone_number=?, program_id=?, university_id=?, tenth_certificate=?, twelfth_certificate=?,bachelor_certificate=? WHERE id=?",
      [
        name,
        email,
        phone_number,
        program_id,
        university_id,
        tenth_certificate,
        twelfth_certificate,
        bachelor_certificate,
        id,
      ]
    );

    return NextResponse.json({ message: "Profile updated successfully" });


  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
