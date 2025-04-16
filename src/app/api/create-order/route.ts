import { NextResponse } from "next/server";
import Razorpay from "razorpay";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export async function POST(req) {


    // console.log("razorpay : ", razorpay);

    const data = await req.json();
    console.log("data : ", data);
    

    try{
        const order = await razorpay.orders.create({
          amount: data.amount,
          currency: "INR",
          receipt: "receipt_" + Math.random().toString(36).substring(7),
        });
        console.log("order : ", order);

        return NextResponse.json(
          { order_id: order.id, receipt: order.receipt },
          { status: 200 }
        );
    }catch(err){
        return NextResponse.json({ error: "eror  while creating order"}, { status: 500 });

    }   
}