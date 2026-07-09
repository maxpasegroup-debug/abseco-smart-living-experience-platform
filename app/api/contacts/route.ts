import { connectDb } from "@/lib/db/connect";
import { Lead } from "@/lib/models/Lead";
import { apiOk, handleApiError } from "@/lib/errors/api";

export async function GET() {
  try {
    await connectDb();
    const leads = await Lead.find().sort({ created_at: -1 }).limit(200);
    const contacts = leads.map((l) => ({
      id: l._id,
      name: l.name,
      phone: l.phone,
      city: l.location,
      lead_score: l.lead_score,
      temperature: l.lead_temperature || l.interest_level,
      interest: l.priority,
      last_interaction: l.last_activity || l.created_at
    }));
    return apiOk({ contacts });
  } catch (error) {
    return handleApiError(error);
  }
}

