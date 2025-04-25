import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {

    const {id} = await req.json();

    const [reminders] = (await db.query(
      "SELECT appointment_date, appointment_time FROM reminder WHERE user_id = ?",
      [id]
    )) as any[];


    return NextResponse.json({
        reminders : reminders[0]
    })
    

  } catch (err) {
    return NextResponse.json({
      err: err,
      reminders: [],
    });
  }
}
