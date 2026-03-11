import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Proposal } from "@/lib/models/Proposal";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposal_id, status } = body;
    if (!proposal_id || !status) {
      return NextResponse.json({ error: "proposal_id and status are required" }, { status: 400 });
    }
    await connectDb();
    const proposal = await Proposal.findById(proposal_id);
    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }
    proposal.status = status;
    const now = new Date();
    if (status === "sent") proposal.sent_at = now;
    if (status === "viewed") proposal.viewed_at = now;
    if (status === "accepted" || status === "rejected") proposal.decided_at = now;
    await proposal.save();
    return NextResponse.json({ proposal });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

