import { connectDb } from "@/lib/db/connect";
import { JourneyEvent } from "@/lib/models/JourneyEvent";
import { Proposal } from "@/lib/models/Proposal";
import { Consultation } from "@/lib/models/Consultation";
import { apiOk, handleApiError } from "@/lib/errors/api";

export async function GET() {
  try {
    await connectDb();

    const visitors = await JourneyEvent.distinct("lead_id", { event_name: "showroom_opened" });
    const explorers = await JourneyEvent.distinct("lead_id", {
      event_name: { $in: ["collection_viewed", "product_experience_opened"] }
    });
    const builders = await JourneyEvent.distinct("lead_id", { event_name: "smart_home_builder_completed" });
    const consultations = await Consultation.distinct("lead_id", {});
    const proposalsSent = await Proposal.distinct("lead_id", { status: "sent" });
    const dealsClosed = await Proposal.distinct("lead_id", { status: { $in: ["accepted", "approved", "converted"] } });

    const steps = [
      { name: "Visitors", count: visitors.length },
      { name: "Showroom Explorers", count: explorers.length },
      { name: "Smart Home Builder Users", count: builders.length },
      { name: "Consultation Bookings", count: consultations.length },
      { name: "Proposals Sent", count: proposalsSent.length },
      { name: "Deals Closed", count: dealsClosed.length }
    ];

    return apiOk({ steps });
  } catch (error) {
    return handleApiError(error);
  }
}

