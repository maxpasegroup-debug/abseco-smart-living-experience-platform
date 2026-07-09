import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { ConsultationRequest } from "@/lib/models/ConsultationRequest";
import { createConsultationRequest } from "@/lib/services/whatsapp-engine";
import { apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { getSessionFromRequest } from "@/lib/auth/session";

const consultationRequestSchema = z.object({
  lead_id: z.string().min(1),
  phone: z.string().min(7).max(20),
  name: z.string().optional(),
  city: z.string().trim().min(1),
  property_type: z.string().trim().min(1),
  construction_stage: z.string().trim().min(1)
});

export async function GET() {
  try {
    await connectDb();
    const requests = await ConsultationRequest.find().sort({ created_at: -1 }).limit(100);
    return apiOk({ requests });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, consultationRequestSchema);
    const { lead_id, phone, name, city, property_type, construction_stage } = body;
    await createConsultationRequest({
      lead_id,
      phone,
      name,
      city,
      property_type,
      construction_stage
    });
    await writeAuditLog({
      request,
      session: await getSessionFromRequest(request),
      action: "consultation_update",
      target_type: "lead",
      target_id: lead_id,
      metadata: { event: "consultation_requested", city, property_type }
    });
    return apiOk({}, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
