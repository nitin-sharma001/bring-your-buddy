import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req) {
    try{

        const {email} = await req.json();

        const [user] = await db.query("Select * from users where email = ?", [email])


        return NextResponse.json({
            user : user[0],
            message : "User fetched Successfully"
        })

    }catch(err){
        return NextResponse.json({
        err: err,
        message: "Error while fetching User",
        });
    }
}