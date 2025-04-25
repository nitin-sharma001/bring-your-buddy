import { db } from "@/lib/db";
import { NextResponse ,} from "next/server";
import {NextRequest} from "next/server";

export async function GET(){

    try{

    const [result] = await db.query("SELECT * FROM course_types ");

    console.log(result, "result of course types");
    

    return NextResponse.json({
        result: result,
        message: "Course types fetched Successfully",
      });
}

catch(error){
    return NextResponse.json({
        error:"error in fetching course trade",
        message:error
    })
}
}