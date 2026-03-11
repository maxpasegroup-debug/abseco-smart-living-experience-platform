import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Lead } from "@/lib/models/Lead";
import { Partner } from "@/lib/models/Partner";

export async function GET() {
  try {
    await connectDb();

    const partners = await Partner.find().sort({ createdAt: -1 }).limit(100);
    const leads = await Lead.find().select("partner_id referral_source interest_level");

    const rows = partners.map((partner) => {
      const partnerLeads = leads.filter(
        (lead) => lead.partner_id === partner.partner_id || lead.referral_source === partner.referral_slug
      );
      const conversions = partnerLeads.filter((lead) => lead.interest_level === "hot").length;
      const commission = conversions * 20000;
      return {
        partner: partner.name,
        partner_id: partner.partner_id,
        leads: partnerLeads.length,
        sales: conversions,
        commission
      };
    });

    return NextResponse.json({
      totalPartners: partners.length,
      leadsByPartner: rows.reduce((sum, row) => sum + row.leads, 0),
      conversions: rows.reduce((sum, row) => sum + row.sales, 0),
      commissionPayable: rows.reduce((sum, row) => sum + row.commission, 0),
      rows
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load admin partner metrics", details: String(error) }, { status: 500 });
  }
}
