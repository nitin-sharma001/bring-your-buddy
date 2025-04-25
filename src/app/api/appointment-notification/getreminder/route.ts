import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {

    const {id} = await req.json();

    const [reminders] = await db.query(
      "SELECT appointment_date, appointment_time FROM reminder WHERE user_id = ?",
      [id]
    );

    // Safely handle the reminders result
    const remindersArray = Array.isArray(reminders) ? reminders : [];
    const reminderData = remindersArray.length > 0 ? remindersArray[0] : null;

    return NextResponse.json({
        reminders: reminderData
    });
    

  } catch (err) {
    return NextResponse.json({
      err: err,
      reminders: [],
    });
  }
}
