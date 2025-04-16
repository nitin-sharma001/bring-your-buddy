import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, program_id, text } = await req.json();

  if (!email || !program_id || !text) {
    return NextResponse.json({ error: "Missing required fields" });
  }

  try {
    const [rows] = await db.execute("SELECT name FROM programs WHERE id = ?", [
      program_id,
    ]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Degree not found" });
    }

    const degreeName = rows[0].name.toLowerCase();
    const lowerText = text.toLowerCase();

    // Map degree name to stream
    let stream = "";

    if (
      degreeName.includes("btech") ||
      degreeName.includes("b.e") ||
      degreeName.includes("b.eng")
    ) {
      stream = "non-medical";
    } else if (degreeName.includes("mbbs")) {
      stream = "medical";
    } else if (
      degreeName.includes("bba") ||
      degreeName.includes("b.com") ||
      degreeName.includes("mba")
    ) {
      stream = "commerce";
    } else if (/\b(ba|ma)\b/.test(degreeName) || degreeName.includes("arts") || degreeName.includes("bba")) {
      stream = "arts";
    } else if (
      /\b(bsc|msc|phd)\b/.test(degreeName) ||
      degreeName.includes("science")
    ) {
      stream = "science";
    }


    // Validate based on stream
    let isValid = false;
    let matchedSubjects = [];

    console.log("degress name", degreeName);
    

    switch (stream) {
      case "non-medical":
        isValid =
          /physics/.test(lowerText) &&
          /chemistry/.test(lowerText) &&
          /\bmath(?:ematics)?\b/.test(lowerText);
        matchedSubjects = ["Physics", "Chemistry", "Math"];
        break;

      case "medical":
        isValid =
          /physics/.test(lowerText) &&
          /chemistry/.test(lowerText) &&
          /biology/.test(lowerText);
        matchedSubjects = ["Physics", "Chemistry", "Biology"];
        break;

      case "commerce":
        matchedSubjects = [];

        const hasAccounts = /accounts?/.test(lowerText);
        const hasBusiness = /business(?:\s+studies)?/.test(lowerText);
        const hasEconOrOther =
          /\b(economics|math(?:ematics)?|english|hindi)\b/.test(lowerText);

        if (hasAccounts) matchedSubjects.push("Accounts");
        if (hasBusiness) matchedSubjects.push("Business Studies");
        if (hasEconOrOther) matchedSubjects.push("Economics");

        isValid = hasAccounts && hasBusiness && hasEconOrOther;
        break;

      case "arts":
        const artsSubjects =
          lowerText.match(
            /\b(history|political\s+science|geography|sociology|psychology|hindi|english)\b/g
          ) || [];
        isValid = artsSubjects.length >= 2;
        matchedSubjects = [...new Set(artsSubjects)];
        break;

      case "science":
        const scienceSubjects =
          lowerText.match(
            /\b(physics|chemistry|mathematics|math|biology)\b/g
          ) || [];

        const normalizedSubjects = [
          ...new Set(
            scienceSubjects.map((sub) => {
              if (sub.includes("math")) return "Math";
              return sub.charAt(0).toUpperCase() + sub.slice(1);
            })
          ),
        ];

        isValid = normalizedSubjects.length >= 2;
        matchedSubjects = normalizedSubjects;
        break;
    }

    console.log("isvalid", isValid);
    console.log("matchedSubjects", matchedSubjects);
    
    

    return NextResponse.json({
      email,
      degree: degreeName,
      stream,
      isValid,
      matchedSubjects,
      message: isValid
        ? `Document is valid for ${degreeName}.`
        : `Document is NOT valid for ${degreeName}.`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" });
  }
}
