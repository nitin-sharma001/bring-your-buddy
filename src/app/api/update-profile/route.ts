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


    const [fetchuser] = await db.query("select * from users where id = ?", [id]);

    const user = fetchuser[0];

    // console.log("user : ", user);
    

  const uploadDir = "./public/uploads/";
  

  await fs.mkdir(uploadDir, { recursive: true });

 const saveFile = async (file) => {
   if (!file) return null;

   if (typeof file === "string" && file.startsWith("/uploads/")) {
     console.log("Skipping already saved file path:", file);
     return file;
   }

   if (typeof file === "object" && file.arrayBuffer) {
     console.log("Saving new file:", file);

     const buffer = Buffer.from(await file.arrayBuffer());
     const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name.replace(/\s+/g, "_")}`;
     const filePath = path.join(uploadDir, fileName);

     await fs.writeFile(filePath, buffer);
     return `/uploads/${fileName}`;
   }

   // Unknown format
   console.log("Unknown file format:", file);
   return null;
 };



    const profile_img = await saveFile(formData.get("profile_img"));
    const tenth_certificate = await saveFile(formData.get("tenth_certificate"));
    const twelfth_certificate = await saveFile(
      formData.get("twelfth_certificate")
    );
    const bachelor_certificate = await saveFile(
      formData.get("bachelor_certificate")
    );

    console.log("tenth_certificate : ", tenth_certificate);
    console.log("twelfth_certificate : ", twelfth_certificate);
    console.log("profile_img : ", profile_img);

    const updatedName = name || user.name;
    const updatedEmail = email || user.email;
    const updatedPhone_number = phone_number || user.phone_number;
    const updatedProfilePhoto = profile_img || user.profile_img;
    const updatedProgram_id = program_id || user.program_id;
    const updatedUnivrsity_id = university_id || user.university_id;
    const updatedTenthCertificate = tenth_certificate || user.tenth_certificate;
    const updatedTwelfthCertificate =
      twelfth_certificate || user.twelfth_certificate;
      const updatedBachelorCertificate = bachelor_certificate || user.bachelor_certificate;
    
    await db.query(
      "UPDATE users SET name=?, email=?, phone_number=?,profile_img=?, program_id=?, university_id=?, tenth_certificate=?, twelfth_certificate=?,bachelor_certificate=? WHERE id=?",
      [
        updatedName,
        updatedEmail,
        updatedPhone_number,
        updatedProfilePhoto,
        updatedProgram_id,
        updatedUnivrsity_id,
        updatedTenthCertificate,
        updatedTwelfthCertificate,
        updatedBachelorCertificate,
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
