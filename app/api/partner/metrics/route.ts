import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    referralLink: "abseco.ai/r/raj-electrician",
    leadsGenerated: 12,
    proposalsSent: 5,
    projectsConfirmed: 3,
    conversions: 3,
    commissionEarned: 45000,
    pendingCommission: 18000,
    leaderboard: ["Raj Electrician", "Smart Build Kochi", "HomeStyle Interiors"],
    leads: [
      { customer: "Rahul", city: "Kochi", interest: "Exploring", status: "New" },
      { customer: "Anil", city: "Trivandrum", interest: "Proposal", status: "Proposal Sent" },
      { customer: "Maya", city: "Calicut", interest: "High", status: "Site Visit Booked" }
    ]
  });
}
