import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try{

        const {email} = await req.json();

        const [user] = await db.query(
          "UPDATE users SET application_submitted = 1 where email = ?",
          [email]
        );

        // Safe access to response data
        const userArray = Array.isArray(user) ? user : [];
        const userData = userArray.length > 0 ? userArray[0] : null;

        return NextResponse.json({
            user: userData,
            message: "User updated Successfully"
        })

    }catch(err){
        return NextResponse.json({
        err: err,
        message: "Error while updating User",
        });
    }
}