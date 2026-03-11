import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Proposal } from "@/lib/models/Proposal";
import { ProposalItem } from "@/lib/models/ProposalItem";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const proposal =
      (await Proposal.findById(params.id)) ||
      (await Proposal.findOne({ proposal_url_slug: params.id }));
    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }
    const items = await ProposalItem.find({ proposal_id: proposal._id.toString() });
    return NextResponse.json({ proposal, items });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

