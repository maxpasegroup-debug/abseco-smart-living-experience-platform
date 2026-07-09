import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { SmartHomePlan } from "@/lib/models/SmartHomePlan";
import { apiOk, handleApiError } from "@/lib/errors/api";
import { requireRole } from "@/lib/auth/guards";
import { CONTROL_ROLES } from "@/lib/auth/roles";

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, CONTROL_ROLES);
    await connectDb();
    const started = await SmartHomePlan.countDocuments();
    const completed = await SmartHomePlan.countDocuments({ status: "completed" });
    const abandoned = await SmartHomePlan.countDocuments({ status: "draft" });
    const roomAgg = await SmartHomePlan.aggregate([
      { $unwind: "$answers.rooms" },
      { $group: { _id: "$answers.rooms", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    const packageAgg = await SmartHomePlan.aggregate([
      { $group: { _id: "$recommendation.packageName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    const budgetAgg = await SmartHomePlan.aggregate([
      { $group: { _id: "$answers.budget", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return apiOk({
      started,
      completed,
      abandoned,
      mostSelectedRooms: roomAgg.map((item) => ({ room: item._id || "Unknown", count: item.count })),
      mostSelectedPackages: packageAgg.map((item) => ({ packageName: item._id || "Unknown", count: item.count })),
      budgetDistribution: budgetAgg.map((item) => ({ budget: item._id || "Unknown", count: item.count }))
    });
  } catch (error) {
    return handleApiError(error);
  }
}
