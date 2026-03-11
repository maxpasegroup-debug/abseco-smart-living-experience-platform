import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { JourneyEvent } from "@/lib/models/JourneyEvent";
import { Lead } from "@/lib/models/Lead";
import { Proposal } from "@/lib/models/Proposal";
import { Consultation } from "@/lib/models/Consultation";

export async function GET() {
  try {
    await connectDb();

    // Campaign performance by referral_source
    const campaignAgg = await Lead.aggregate([
      {
        $group: {
          _id: "$referral_source",
          leads: { $sum: 1 }
        }
      }
    ]);

    const consultationsBySource = await Consultation.aggregate([
      {
        $lookup: {
          from: "leads",
          localField: "lead_id",
          foreignField: "_id",
          as: "lead"
        }
      },
      { $unwind: "$lead" },
      {
        $group: {
          _id: "$lead.referral_source",
          consultations: { $sum: 1 }
        }
      }
    ]);

    const dealsBySource = await Proposal.aggregate([
      { $match: { status: "accepted" } },
      {
        $lookup: {
          from: "leads",
          localField: "lead_id",
          foreignField: "_id",
          as: "lead"
        }
      },
      { $unwind: "$lead" },
      {
        $group: {
          _id: "$lead.referral_source",
          deals: { $sum: 1 }
        }
      }
    ]);

    const campaigns = campaignAgg.map((c) => {
      const source = c._id || "unknown";
      const consultations =
        consultationsBySource.find((x) => (x._id || "unknown") === source)?.consultations || 0;
      const deals = dealsBySource.find((x) => (x._id || "unknown") === source)?.deals || 0;
      return { source, leads: c.leads, consultations, deals };
    });

    // Product interest: events by category
    const interestAgg = await JourneyEvent.aggregate([
      { $match: { event_name: { $in: ["collection_viewed", "product_experience_opened"] } } },
      {
        $group: {
          _id: "$metadata.category",
          count: { $sum: 1 }
        }
      }
    ]);
    const totalInterest = interestAgg.reduce((sum, i) => sum + i.count, 0) || 1;
    const product_interest = interestAgg.map((i) => ({
      category: i._id || "Unknown",
      percent: Math.round((i.count / totalInterest) * 100)
    }));

    // Simple insights (placeholder)
    const insights: string[] = [];

    const builderUsers = await JourneyEvent.distinct("lead_id", {
      event_name: "smart_home_builder_completed"
    });
    const builderDeals = await Proposal.countDocuments({
      status: "accepted",
      lead_id: { $in: builderUsers }
    });
    if (builderUsers.length && builderDeals) {
      insights.push("Leads who complete Smart Home Builder convert more often.");
    }

    const cameraUsers = await JourneyEvent.distinct("lead_id", {
      event_name: "camera_experience_used"
    });
    const cameraConsultations = await Consultation.countDocuments({
      lead_id: { $in: cameraUsers }
    });
    if (cameraUsers.length && cameraConsultations) {
      insights.push("Camera experience users request consultations faster.");
    }

    return NextResponse.json({
      campaigns,
      product_interest,
      insights
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

