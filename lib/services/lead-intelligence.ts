import { connectDb } from "@/lib/db/connect";
import { Lead, LeadDocument, LeadEngagementEvent, LeadTemperature } from "@/lib/models/Lead";
import { SalesNotification } from "@/lib/models/SalesNotification";
import { queueMessage } from "@/lib/services/whatsapp-engine";

type ScoreResult = {
  score: number;
  temperature: LeadTemperature;
};

function clampScore(score: number): number {
  if (score < 0) return 0;
  if (score > 100) return 100;
  return Math.round(score);
}

export function calculateLeadScore(lead: LeadDocument): ScoreResult {
  let score = 0;

  const source = (lead.referral_source || "").toLowerCase();

  // Lead source weights
  if (source.includes("google")) score += 30;
  if (source.includes("search")) score += 30;
  if (source.includes("instagram") || source.includes("ig")) score += 15;
  if (source.includes("showroom")) score += 20;
  if (source.includes("partner")) score += 10;

  // Property type weighting
  const homeType = (lead.home_type || "").toLowerCase();
  if (homeType.includes("villa") || homeType.includes("luxury")) score += 20;
  else if (homeType.includes("apartment") || homeType.includes("flat") || homeType.includes("penthouse")) score += 12;
  else if (homeType.includes("office") || homeType.includes("commercial")) score += 10;

  // Budget indicator (very approximate based on label text)
  const budget = (lead.budget || "").toLowerCase();
  if (budget.includes("premium") || budget.includes("luxury") || budget.includes("15l+") || budget.includes("20l+")) {
    score += 20;
  } else if (budget.includes("standard") || budget.includes("5l-") || budget.includes("8l")) {
    score += 10;
  }

  const events: LeadEngagementEvent[] = lead.engagement_events || [];
  const types = new Set(events.map((e) => e.type));

  // Behavioural events
  if (types.has("showroom_visited")) score += 10;
  if (types.has("builder_completed")) score += 25;
  if (types.has("camera_experience_used")) score += 10;
  if (types.has("product_added")) score += 20;
  if (types.has("consultation_requested")) score += 40;

  // Engagement / responses
  if (types.has("whatsapp_reply")) score += 15;
  if (types.has("link_clicked")) score += 10;
  if (types.has("consultation_booked")) score += 25;

  const finalScore = clampScore(score);

  let temperature: LeadTemperature = "cold";
  if (finalScore >= 80) temperature = "hot";
  else if (finalScore >= 50) temperature = "warm";

  return { score: finalScore, temperature };
}

export async function recordEngagementEvent(params: {
  leadId: string;
  type: string;
  context?: string;
  metadata?: Record<string, unknown>;
}): Promise<{ lead: LeadDocument | null; score: number; temperature: LeadTemperature }> {
  await connectDb();
  const lead = await Lead.findById(params.leadId);
  if (!lead) {
    return { lead: null, score: 0, temperature: "cold" };
  }

  const event: LeadEngagementEvent = {
    type: params.type,
    context: params.context,
    metadata: params.metadata,
    created_at: new Date()
  };

  lead.engagement_events = [...(lead.engagement_events || []), event];
  lead.last_activity = event.created_at;

  const { score, temperature } = calculateLeadScore(lead.toObject());

  const previousTemperature = lead.lead_temperature || lead.interest_level || "warm";

  lead.lead_score = score;
  lead.lead_temperature = temperature;
  lead.interest_level = temperature;

  await lead.save();

  // When a lead becomes HOT for the first time, route to sales, notify, and send booking link.
  if (previousTemperature !== "hot" && temperature === "hot") {
    if (!lead.assigned_sales_rep) {
      lead.assigned_sales_rep = "abseco-sales";
      await lead.save();
    }
    await SalesNotification.create({
      type: "hot_lead",
      lead_id: lead._id.toString(),
      title: "New high-intent smart home lead",
      body: `${lead.name} became a HOT LEAD. Source: ${lead.referral_source || "unknown"}.`,
      read: false
    });

    if (lead.phone) {
      const bookingMessage =
        "Thank you for your interest in ABSECO Smart Living.\n\n" +
        "You can schedule a free smart home consultation here:\n\n" +
        `${process.env.NEXT_PUBLIC_BASE_URL || ""}/consultation`;
      await queueMessage({
        to: lead.phone,
        message: bookingMessage,
        lead_id: lead._id.toString()
      });
    }
  }

  return { lead: lead.toObject(), score, temperature };
}

export async function recalculateLeadScore(leadId: string): Promise<ScoreResult | null> {
  await connectDb();
  const lead = await Lead.findById(leadId);
  if (!lead) return null;

  const { score, temperature } = calculateLeadScore(lead.toObject());
  lead.lead_score = score;
  lead.lead_temperature = temperature;
  lead.interest_level = temperature;
  await lead.save();

  return { score, temperature };
}

