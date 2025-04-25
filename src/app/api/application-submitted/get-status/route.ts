import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Define an interface for the status object
interface ApplicationStatus {
  application_submitted: number;
  [key: string]: any;
}

export async function POST(req: Request) {
    try{

        const {email} = await req.json();

        const [status] = await db.query(
          "Select application_submitted from users where email = ?",
          [email]
        );

        // Type check and ensure there's a result
        const statusArray = Array.isArray(status) ? status : [];
        const statusObj = statusArray.length > 0 ? statusArray[0] as ApplicationStatus : { application_submitted: 0 };

        return NextResponse.json({
          status: statusObj,
          message: "application_submitted fetched Successfully",
        });

    }catch(err){
        return NextResponse.json({
          err: err,
          message: "Error while fetching application_submitted",
        });
    }
}