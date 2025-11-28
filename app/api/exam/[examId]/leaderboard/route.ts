import { connectDB } from '@/lib/db';
import { Score } from '@/lib/schemas/score.schema';
// Import User model to ensure schema registration
import { User } from '@/lib/schemas/user.schema'; 
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    await connectDB();
    
    // Ensure models are registered
    const _models = [User, Score];
    
    const { examId } = await params;
    
    const leaderboard = await Score.aggregate([
      // 1. Filter for this exam and only finished attempts
      {
        $match: { 
          examId: new mongoose.Types.ObjectId(examId),
          status: 'finished'
        }
      },
      // 2. Sort by score descending (so the first item per student is their best)
      {
        $sort: { normalizedScore: -1 }
      },
      // 3. Group by Student ID to deduplicate
      {
        $group: {
          _id: "$studentId",
          highestScore: { $first: "$normalizedScore" }, // Take the best score
          attempts: { $sum: 1 }, // Count total attempts
          // Capture details from the best attempt
          originalId: { $first: "$_id" },
          terminatedForCheating: { $first: "$terminatedForCheating" },
          completedAt: { $first: "$completedAt" }
        }
      },
      // 4. Join with User collection to get username
      {
        $lookup: {
          from: "users", // Mongoose defaults collection name to 'users'
          localField: "_id",
          foreignField: "_id",
          as: "studentDetails"
        }
      },
      // 5. Flatten the user array
      {
        $unwind: "$studentDetails"
      },
      // 6. Format the output
      {
        $project: {
          _id: "$originalId",
          studentId: {
            username: "$studentDetails.username"
          },
          normalizedScore: "$highestScore",
          attempts: "$attempts",
          terminatedForCheating: "$terminatedForCheating",
          completedAt: "$completedAt"
        }
      },
      // 7. Sort the final list by score
      {
        $sort: { normalizedScore: -1 }
      },
      // 8. Limit to top 50
      {
        $limit: 50
      }
    ]);
    
    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
