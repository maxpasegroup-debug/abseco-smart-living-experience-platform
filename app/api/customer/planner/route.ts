import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { connectDb } from "@/lib/db/connect";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { getCustomerRecords } from "@/lib/services/customer-dashboard";
import { SmartHomePlan } from "@/lib/models/SmartHomePlan";
import { recordTimeline } from "@/lib/services/revenue-engine";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    await connectDb();
    const records = await getCustomerRecords(session);
    return apiOk({ plans: records.plans });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    const body = await request.json().catch(() => ({}));
    if (body.action !== "duplicate" || !body.plan_id) {
      return apiError("BAD_REQUEST", "Unsupported planner action.", 400);
    }
    await connectDb();
    const plan = await SmartHomePlan.findOne({ _id: body.plan_id, customer_id: session.user.id });
    if (!plan) return apiError("NOT_FOUND", "Planner plan not found.", 404);
    const duplicate = await SmartHomePlan.create({
      customer_id: session.user.id,
      status: "draft",
      current_step: plan.current_step,
      answers: plan.answers,
      recommendation: plan.recommendation,
      structured_plan: plan.structured_plan,
      conversion_status: "saved",
      source: "customer-dashboard-duplicate"
    });
    await recordTimeline({
      customerId: session.user.id,
      plannerPlanId: duplicate._id.toString(),
      eventName: "planner_duplicated",
      title: "Planner duplicated"
    });
    return apiOk({ plan: duplicate }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
