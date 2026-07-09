import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { JourneyEvent } from "@/lib/models/JourneyEvent";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";

export async function GET(request: NextRequest) {
  try {
    const lead_id = request.nextUrl.searchParams.get("lead_id");
    if (!lead_id) {
      return apiError("BAD_REQUEST", "lead_id is required.", 400);
    }
    await connectDb();
    const events = await JourneyEvent.find({ lead_id }).sort({ timestamp: 1 }).limit(200);
    return apiOk({ lead_id, events });
  } catch (error) {
    return handleApiError(error);
  }
}

