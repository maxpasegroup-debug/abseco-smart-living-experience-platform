import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { CONTROL_ROLES } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/guards";
import { apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import {
  assignEngineer,
  generateProjectHandover,
  getProjectDetails,
  recordProjectPhoto,
  submitQaReview,
  updateChecklistItem,
  updateProjectStage,
  updateRoomProgress
} from "@/lib/services/project-service";

const projectPatchSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("stage"),
    status: z.enum([
      "project_created",
      "planning",
      "material_ordered",
      "material_ready",
      "engineer_assigned",
      "visit_scheduled",
      "visit_completed",
      "installation_started",
      "lighting",
      "curtains",
      "security",
      "automation",
      "testing",
      "qa",
      "customer_review",
      "completed",
      "handover",
      "cancelled"
    ]),
    remarks: z.string().optional()
  }),
  z.object({
    action: z.literal("assign_engineer"),
    engineer_id: z.string().min(1),
    assignment_role: z.enum(["primary", "assistant", "project_manager"]),
    remarks: z.string().optional()
  }),
  z.object({
    action: z.literal("room"),
    room: z.string().min(1),
    status: z.enum(["pending", "in_progress", "completed", "quality_passed", "customer_approved"]),
    remarks: z.string().optional()
  }),
  z.object({
    action: z.literal("checklist"),
    key: z.string().min(1),
    status: z.enum(["pending", "passed", "failed", "not_applicable"]),
    remarks: z.string().optional()
  }),
  z.object({
    action: z.literal("photo"),
    url: z.string().min(1),
    category: z.enum(["before", "during", "after", "testing", "completion"]),
    room: z.string().optional(),
    engineer_id: z.string().optional(),
    caption: z.string().optional()
  }),
  z.object({
    action: z.literal("qa"),
    checklist: z.array(
      z.object({
        key: z.string().min(1),
        status: z.enum(["pending", "passed", "failed", "not_applicable"]),
        remarks: z.string().optional()
      })
    ),
    remarks: z.string().optional()
  }),
  z.object({
    action: z.literal("handover")
  })
]);

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, CONTROL_ROLES);
    await connectDb();
    const details = await getProjectDetails(params.id);
    return apiOk(details);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireRole(request, CONTROL_ROLES);
    const body = await parseJson(request, projectPatchSchema);
    await connectDb();
    const updatedBy = session.user.id;
    if (body.action === "stage") {
      const project = await updateProjectStage({ projectId: params.id, status: body.status, remarks: body.remarks, updatedBy });
      return apiOk({ project });
    }
    if (body.action === "assign_engineer") {
      const project = await assignEngineer({
        projectId: params.id,
        engineerId: body.engineer_id,
        assignmentRole: body.assignment_role,
        remarks: body.remarks,
        updatedBy
      });
      return apiOk({ project });
    }
    if (body.action === "room") {
      const project = await updateRoomProgress({
        projectId: params.id,
        room: body.room,
        status: body.status,
        remarks: body.remarks,
        updatedBy
      });
      return apiOk({ project });
    }
    if (body.action === "checklist") {
      const project = await updateChecklistItem({
        projectId: params.id,
        key: body.key,
        status: body.status,
        remarks: body.remarks,
        updatedBy
      });
      return apiOk({ project });
    }
    if (body.action === "photo") {
      const project = await recordProjectPhoto({
        projectId: params.id,
        url: body.url,
        category: body.category,
        room: body.room,
        engineerId: body.engineer_id,
        caption: body.caption
      });
      return apiOk({ project });
    }
    if (body.action === "qa") {
      const project = await submitQaReview({
        projectId: params.id,
        checklist: body.checklist,
        inspectedBy: updatedBy,
        remarks: body.remarks
      });
      return apiOk({ project });
    }
    const project = await generateProjectHandover(params.id, updatedBy);
    return apiOk({ project });
  } catch (error) {
    return handleApiError(error);
  }
}
