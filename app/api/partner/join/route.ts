import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Partner } from "@/lib/models/Partner";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";

const partnerJoinSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().min(7).max(20),
  profession: z.string().trim().min(1),
  city: z.string().trim().min(1),
  years_experience: z.number().min(0),
  company_name: z.string().optional()
});

function buildSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, partnerJoinSchema);
    const { name, phone, profession, city, years_experience, company_name } = body;

    if (!name || !phone || !profession || !city || years_experience === undefined) {
      return apiError("BAD_REQUEST", "Missing required fields.", 400);
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

    return apiOk({
      partner: {
        name: partner.name,
        partner_id: partner.partner_id,
        referral_slug: partner.referral_slug,
        referral_link: `abseco.ai/r/${partner.referral_slug}`,
        dashboard: "/partner"
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
