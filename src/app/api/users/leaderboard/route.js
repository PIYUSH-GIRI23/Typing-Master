import { NextResponse } from "next/server";
import connectDB from "@/app/database/db";

export async function GET() {
  try {
    const { leaderboard } = await connectDB();

    // Fetch all records and exclude the _id field
    const allRecords = await leaderboard.find({}, { projection: { _id: 0 } }).toArray();

    // Sort records based on accuracy, wpm, lastactive, and username in descending order
    const sortedRecords = allRecords.sort((a, b) => {
      const userA = Object.keys(a)[0];
      const userB = Object.keys(b)[0];

      // Compare accuracy (descending order)
      const accuracyDiff = parseFloat(b[userB].accuracy) - parseFloat(a[userA].accuracy);
      if (accuracyDiff !== 0) return accuracyDiff;

      // Compare wpm (descending order)
      const wpmDiff = b[userB].wpm - a[userA].wpm;
      if (wpmDiff !== 0) return wpmDiff;

      // Compare lastactive (descending order)
      const lastActiveDiff = b[userB].lastactive - a[userA].lastactive;
      if (lastActiveDiff !== 0) return lastActiveDiff;

      // Compare usernames (reverse lexicographical order)
      return userB.localeCompare(userA);
    });

    // Log the sorted array for inspection
    // console.log("Sorted Records:", sortedRecords);

    return NextResponse.json({ details: sortedRecords, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
}
