import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Template } from "@/lib/models/Template";
import { apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { getSessionFromRequest } from "@/lib/auth/session";

const templateCreateSchema = z.object({
  channel: z.enum(["whatsapp", "email", "sms"]).default("whatsapp"),
  name: z.string().trim().min(1),
  title: z.string().trim().min(1),
  body: z.string().trim().min(1),
  media_url: z.string().url().optional(),
  category: z.string().optional()
});

export async function GET() {
  try {
    await connectDb();
    const templates = await Template.find().sort({ created_at: -1 });
    return apiOk({ templates });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, templateCreateSchema);
    const { channel = "whatsapp", name, title, body: messageBody, media_url, category } = body;
    await connectDb();
    const template = await Template.create({
      channel,
      name,
      title,
      body: messageBody,
      media_url,
      category
    });
    await writeAuditLog({
      request,
      session: await getSessionFromRequest(request),
      action: "customer_change",
      target_type: "template",
      target_id: template._id.toString(),
      metadata: { event: "template_created", channel }
    });
    return apiOk({ template }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

