import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Partner } from "@/lib/models/Partner";

function buildSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, profession, city, years_experience, company_name } = body;

    if (!name || !phone || !profession || !city || !years_experience) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDb();

    const baseSlug = buildSlug(`${name}-${profession}`);
    const partner_id = `PT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const referral_slug = `${baseSlug}-${partner_id.toLowerCase()}`;

    const partner = await Partner.create({
      name,
      phone,
      profession,
      city,
      years_experience: Number(years_experience),
      company_name,
      partner_id,
      referral_slug,
      status: "approved",
      commission_rate: profession === "Builder" || profession === "Architect" ? 6 : 4
    });

    return NextResponse.json({
      ok: true,
      partner: {
        name: partner.name,
        partner_id: partner.partner_id,
        referral_slug: partner.referral_slug,
        referral_link: `abseco.ai/r/${partner.referral_slug}`,
        dashboard: "/partner"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Partner signup failed", details: String(error) }, { status: 500 });
  }
}
