import connectDB from "@/app/database/db";
import { NextResponse } from "next/server";
import Middleware from "@/app/api/passage/middleware";

export async function POST(req, res) {
  try {
      const { passage, users } = await connectDB();
      const payload = await req.json();
      console.log(payload);


    // Commenting out the Middleware call as it's not being used currently
    let response = await Middleware(req, payload.username, Users);
    if (response.status !== 200) {
      return NextResponse.json({ error: "Invalid Token", status: 401 });
    }

    const passagedetails = await passage.findOne({
        passageid: payload.passageid,
    });
    // const username=await users.findOne({username:payload.username});

    if (!passagedetails) {
      return NextResponse.json({ status: 404, message: "Passage Not Found" });
    }

    return NextResponse.json({ status: 200, details: passagedetails.usernames[payload.username] });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
