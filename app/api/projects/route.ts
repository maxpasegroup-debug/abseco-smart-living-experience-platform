import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { CONTROL_ROLES } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/guards";
import { apiOk, handleApiError } from "@/lib/errors/api";
import { z } from "@/lib/validation";
import { Engineer } from "@/lib/models/Engineer";
import { createProjectFromPaidOrder, getControlProjects, getProjectAnalytics } from "@/lib/services/project-service";

const projectCreateSchema = z.object({
  order_id: z.string().min(1)
});

const engineerCreateSchema = z.object({
  name: z.string().min(2),
  role: z.enum(["primary", "assistant", "qa", "project_manager"]).default("primary"),
  region: z.string().min(2).default("Default"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  skills: z.array(z.string()).default([]),
  availability_status: z.enum(["available", "assigned", "on_leave", "inactive"]).default("available")
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, CONTROL_ROLES);
    await connectDb();
    const [projects, engineers, analytics] = await Promise.all([
      getControlProjects(),
      Engineer.find({ active: { $ne: false } }).sort({ name: 1 }).limit(100),
      getProjectAnalytics()
    ]);
    return apiOk({ projects, engineers, analytics });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, CONTROL_ROLES);
    const body = await request.json().catch(() => ({}));
    await connectDb();
    if (body.action === "create_engineer") {
      const input = engineerCreateSchema.parse(body);
      const engineer = await Engineer.create(input);
      return apiOk({ engineer }, 201);
    }
    const input = projectCreateSchema.parse(body);
    const project = await createProjectFromPaidOrder(input.order_id);
    return apiOk({ project }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
