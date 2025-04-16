
import { db } from '@/lib/db';
import { NextResponse,NextRequest } from 'next/server';
export async function POST(req:NextRequest){
    try{   
    const {email} = await req.json();
    const result = await db.query(
      "UPDATE users SET offer_letter_status = ? WHERE email = ?",
      [1, email]
    );
    return NextResponse.json(
        { success: true, message: "Offer letter status updated successfully" },
        { status: 200 }
    );
}

catch (error){
    console.error("Error updating offer letter status:", error);
    return NextResponse.json(
        { success: false, message: "Failed to update offer letter status" },
        { status: 500 }
    );
}
}