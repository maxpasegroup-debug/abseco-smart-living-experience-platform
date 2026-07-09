import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { JourneyEvent } from "@/lib/models/JourneyEvent";
import { Lead } from "@/lib/models/Lead";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";

const journeyEventSchema = z.object({
  lead_id: z.string().optional(),
  event_name: z.string().trim().min(1),
  metadata: z.record(z.unknown()).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, journeyEventSchema);
    const { lead_id, event_name, metadata } = body;
    if (!event_name) {
      return apiError("BAD_REQUEST", "event_name is required.", 400);
    }

    await connectDb();
    await JourneyEvent.create({
      lead_id,
      event_name,
      metadata,
      timestamp: new Date()
    });

    if (lead_id) {
      await Lead.updateOne(
        { _id: lead_id },
        {
          $set: { last_activity: new Date() },
          $push: {
            engagement_events: {
              type: event_name,
              metadata,
              created_at: new Date()
            }
          }
        }
      );
    }

    return apiOk({});
  } catch (error) {
    return handleApiError(error);
  }
}

