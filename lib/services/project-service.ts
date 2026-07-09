import { Engineer } from "@/lib/models/Engineer";
import { Lead } from "@/lib/models/Lead";
import { Order, type OrderDocument } from "@/lib/models/Order";
import { Project, type ChecklistStatus, type ProjectDocument, type ProjectStatus, type RoomProgressStatus } from "@/lib/models/Project";
import { Proposal } from "@/lib/models/Proposal";
import { SalesNotification, type SalesNotificationDocument } from "@/lib/models/SalesNotification";
import { SmartHomePlan } from "@/lib/models/SmartHomePlan";
import { recordTimeline } from "@/lib/services/revenue-engine";

const defaultRooms = ["Living Room", "Bedroom", "Kitchen", "Dining", "Outdoor", "Home Theatre", "Office", "Bathroom"];
const defaultChecklist = [
  ["electrical", "Electrical"],
  ["controllers", "Controllers"],
  ["switches", "Switches"],
  ["curtains", "Curtains"],
  ["sensors", "Sensors"],
  ["lighting", "Lighting"],
  ["voice", "Voice"],
  ["wifi", "WiFi"],
  ["testing", "Testing"]
] as const;
const defaultQa = [
  ["electrical", "Electrical"],
  ["lighting", "Lighting"],
  ["automation", "Automation"],
  ["curtains", "Curtains"],
  ["voice", "Voice"],
  ["security", "Security"],
  ["audio", "Audio"],
  ["internet", "Internet"]
] as const;

const stageProgress: Partial<Record<ProjectStatus, number>> = {
  project_created: 5,
  planning: 10,
  material_ordered: 18,
  material_ready: 28,
  engineer_assigned: 35,
  visit_scheduled: 42,
  visit_completed: 48,
  installation_started: 55,
  lighting: 62,
  curtains: 68,
  security: 72,
  automation: 78,
  testing: 86,
  qa: 91,
  customer_review: 95,
  completed: 100,
  handover: 100,
  cancelled: 0
};

function createNumber(prefix: string) {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${stamp}-${suffix}`;
}

function resolvePlanRooms(plan?: { structured_plan?: unknown; answers?: unknown } | null) {
  const structured = plan?.structured_plan as { selectedRooms?: unknown } | undefined;
  const answers = plan?.answers as { rooms?: unknown } | undefined;
  const rooms = Array.isArray(structured?.selectedRooms)
    ? structured.selectedRooms
    : Array.isArray(answers?.rooms)
      ? answers.rooms
      : defaultRooms;
  return rooms.filter((room): room is string => typeof room === "string" && room.trim().length > 0);
}

function buildRoomProgress(rooms: string[]) {
  const uniqueRooms = Array.from(new Set(rooms.length ? rooms : defaultRooms));
  return uniqueRooms.map((room) => ({
    room,
    status: "pending" as RoomProgressStatus,
    completion_percentage: 0,
    updated_at: new Date()
  }));
}

function buildChecklist() {
  return defaultChecklist.map(([key, label]) => ({ key, label, status: "pending" as ChecklistStatus }));
}

function buildQaChecklist() {
  return defaultQa.map(([key, label]) => ({ key, label, status: "pending" as ChecklistStatus }));
}

function titleFromStatus(status: ProjectStatus) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function notificationTypeForStatus(status: ProjectStatus): SalesNotificationDocument["type"] | undefined {
  if (status === "project_created") return "project_created";
  if (status === "engineer_assigned") return "engineer_assigned";
  if (status === "visit_scheduled") return "visit_scheduled";
  if (status === "installation_started") return "installation_started";
  if (status === "testing") return "testing_completed";
  if (status === "customer_review") return "ready_for_review";
  if (status === "completed" || status === "handover") return "project_completed";
  return undefined;
}

async function notifyProject(project: ProjectDocument & { _id?: { toString(): string } }, type: SalesNotificationDocument["type"], title: string, body: string) {
  const leadId = project.lead_id || project._id?.toString() || "project";
  const recipients: Array<{ role: SalesNotificationDocument["recipient_role"]; id?: string }> = [
    { role: "admin" },
    { role: "sales", id: project.project_manager || project.sales_executive }
  ];
  if (project.customer_id) recipients.push({ role: "customer", id: project.customer_id });
  await Promise.all(
    recipients.map((recipient) =>
      SalesNotification.create({
        type,
        lead_id: leadId,
        recipient_role: recipient.role,
        recipient_id: recipient.id,
        title,
        body
      })
    )
  );
}

async function timelineForProject(project: ProjectDocument & { _id?: { toString(): string } }, eventName: string, title: string, metadata?: Record<string, unknown>) {
  return recordTimeline({
    leadId: project.lead_id,
    customerId: project.customer_id,
    plannerPlanId: project.planner_plan_id,
    proposalId: project.proposal_id,
    orderId: project.order_id,
    projectId: project._id?.toString(),
    eventName,
    title,
    metadata
  });
}

export async function createProjectFromPaidOrder(orderId: string) {
  const existing = await Project.findOne({ order_id: orderId });
  if (existing) return existing;
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found.");
  const [lead, proposal, plan] = await Promise.all([
    order.lead_id ? Lead.findById(order.lead_id) : null,
    order.proposal_id ? Proposal.findById(order.proposal_id) : null,
    order.planner_plan_id ? SmartHomePlan.findById(order.planner_plan_id) : null
  ]);
  const expectedStart = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const expectedCompletion = order.expected_installation_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const project = await Project.create({
    project_number: createNumber("ABP"),
    customer_id: order.customer_id || proposal?.customer_id,
    lead_id: order.lead_id,
    planner_plan_id: order.planner_plan_id || proposal?.planner_plan_id,
    proposal_id: order.proposal_id,
    order_id: order._id?.toString(),
    sales_executive: order.sales_executive || proposal?.assigned_sales_rep || lead?.assigned_sales_rep,
    priority: order.priority === "High" ? "High" : "Medium",
    status: "project_created",
    expected_start: expectedStart,
    expected_completion: expectedCompletion,
    completion_percentage: 5,
    remarks: "Project created after booking payment.",
    stages: [{ stage: "project_created", timestamp: new Date(), remarks: "Project created after booking payment." }],
    rooms: buildRoomProgress(resolvePlanRooms(plan)),
    checklist: buildChecklist(),
    qa: { checklist: buildQaChecklist(), status: "pending" },
    customer_approval: { status: "pending", digital_acceptance: false },
    handover: { ready_for_warranty: false }
  });
  order.status = "installation_pending";
  await (order as OrderDocument & { save(): Promise<unknown> }).save();
  await timelineForProject(project, "project_created", "Project created", { project_number: project.project_number });
  await notifyProject(project, "project_created", "Project created", `Project ${project.project_number} has been created.`);
  return project;
}

export async function getControlProjects() {
  return Project.find({}).sort({ updated_at: -1 }).limit(100);
}

export async function getCustomerProjects(customerId: string, leadIds: string[] = []) {
  return Project.find({
    $or: [{ customer_id: customerId }, { lead_id: { $in: leadIds } }]
  })
    .sort({ updated_at: -1 })
    .limit(25);
}

export async function getProjectDetails(projectId: string) {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found.");
  const [order, lead, proposal, plan, primaryEngineer, assistantEngineers] = await Promise.all([
    project.order_id ? Order.findById(project.order_id) : null,
    project.lead_id ? Lead.findById(project.lead_id) : null,
    project.proposal_id ? Proposal.findById(project.proposal_id) : null,
    project.planner_plan_id ? SmartHomePlan.findById(project.planner_plan_id) : null,
    project.primary_engineer_id ? Engineer.findById(project.primary_engineer_id) : null,
    Engineer.find({ _id: { $in: project.assistant_engineer_ids || [] } })
  ]);
  return { project, order, lead, proposal, plan, primaryEngineer, assistantEngineers };
}

export async function updateProjectStage(params: { projectId: string; status: ProjectStatus; remarks?: string; updatedBy?: string }) {
  const project = await Project.findById(params.projectId);
  if (!project) throw new Error("Project not found.");
  project.status = params.status;
  project.completion_percentage = stageProgress[params.status] ?? project.completion_percentage;
  if (params.status === "completed" || params.status === "handover") {
    project.actual_completion = new Date();
  }
  project.stages.push({ stage: params.status, timestamp: new Date(), updated_by: params.updatedBy, remarks: params.remarks });
  await project.save();
  const title = titleFromStatus(params.status);
  await timelineForProject(project, params.status, title, { remarks: params.remarks });
  const type = notificationTypeForStatus(params.status);
  if (type) await notifyProject(project, type, title, `${project.project_number}: ${title}.`);
  if (params.status === "qa") await notifyProject(project, "pending_qa", "Pending QA", `${project.project_number} is ready for QA.`);
  if (params.status === "customer_review") {
    await notifyProject(project, "pending_approval", "Pending customer approval", `${project.project_number} is ready for customer review.`);
  }
  return project;
}

export async function assignEngineer(params: {
  projectId: string;
  engineerId: string;
  assignmentRole: "primary" | "assistant" | "project_manager";
  remarks?: string;
  updatedBy?: string;
}) {
  const [project, engineer] = await Promise.all([Project.findById(params.projectId), Engineer.findById(params.engineerId)]);
  if (!project || !engineer) throw new Error("Project or engineer not found.");
  if (params.assignmentRole === "primary") project.primary_engineer_id = engineer._id.toString();
  if (params.assignmentRole === "project_manager") project.project_manager = engineer.name;
  if (params.assignmentRole === "assistant") {
    const ids = new Set(project.assistant_engineer_ids || []);
    ids.add(engineer._id.toString());
    project.assistant_engineer_ids = Array.from(ids);
  }
  project.status = "engineer_assigned";
  project.completion_percentage = Math.max(project.completion_percentage || 0, 35);
  project.stages.push({ stage: "engineer_assigned", timestamp: new Date(), updated_by: params.updatedBy, remarks: params.remarks });
  project.engineer_history.push({
    engineer_id: engineer._id.toString(),
    engineer_name: engineer.name,
    role: params.assignmentRole,
    action: project.primary_engineer_id ? "reassigned" : "assigned",
    updated_by: params.updatedBy,
    remarks: params.remarks,
    timestamp: new Date()
  });
  await Promise.all([
    project.save(),
    Engineer.updateOne(
      { _id: engineer._id },
      {
        $addToSet: { assigned_project_ids: project._id?.toString() },
        $set: { availability_status: "assigned" }
      }
    )
  ]);
  await timelineForProject(project, "engineer_assigned", "Engineer assigned", { engineer: engineer.name, role: params.assignmentRole });
  await notifyProject(project, "engineer_assigned", "Engineer assigned", `${engineer.name} assigned to ${project.project_number}.`);
  return project;
}

export async function updateRoomProgress(params: {
  projectId: string;
  room: string;
  status: RoomProgressStatus;
  remarks?: string;
  updatedBy?: string;
}) {
  const project = await Project.findById(params.projectId);
  if (!project) throw new Error("Project not found.");
  const room = project.rooms.find((item) => item.room === params.room);
  const percentage = params.status === "customer_approved" ? 100 : params.status === "quality_passed" ? 90 : params.status === "completed" ? 75 : params.status === "in_progress" ? 40 : 0;
  if (room) {
    room.status = params.status;
    room.completion_percentage = percentage;
    room.remarks = params.remarks;
    room.updated_by = params.updatedBy;
    room.updated_at = new Date();
  } else {
    project.rooms.push({
      room: params.room,
      status: params.status,
      completion_percentage: percentage,
      remarks: params.remarks,
      updated_by: params.updatedBy,
      updated_at: new Date()
    });
  }
  const average = project.rooms.reduce((sum, item) => sum + (item.completion_percentage || 0), 0) / Math.max(project.rooms.length, 1);
  project.completion_percentage = Math.max(project.completion_percentage || 0, Math.round(average));
  await project.save();
  await timelineForProject(project, "room_progress_updated", `${params.room} ${params.status.replace(/_/g, " ")}`, { room: params.room });
  return project;
}

export async function updateChecklistItem(params: {
  projectId: string;
  key: string;
  status: ChecklistStatus;
  remarks?: string;
  updatedBy?: string;
}) {
  const project = await Project.findById(params.projectId);
  if (!project) throw new Error("Project not found.");
  const item = project.checklist.find((entry) => entry.key === params.key);
  if (!item) throw new Error("Checklist item not found.");
  item.status = params.status;
  item.remarks = params.remarks;
  item.updated_by = params.updatedBy;
  item.updated_at = new Date();
  await project.save();
  await timelineForProject(project, "installation_checklist_updated", `${item.label} checklist updated`, { key: item.key, status: item.status });
  return project;
}

export async function recordProjectPhoto(params: {
  projectId: string;
  url: string;
  category: "before" | "during" | "after" | "testing" | "completion";
  room?: string;
  engineerId?: string;
  caption?: string;
}) {
  const project = await Project.findById(params.projectId);
  if (!project) throw new Error("Project not found.");
  const engineer = params.engineerId ? await Engineer.findById(params.engineerId) : null;
  project.photos.push({
    url: params.url,
    category: params.category,
    room: params.room,
    engineer_id: params.engineerId,
    engineer_name: engineer?.name,
    caption: params.caption,
    uploaded_at: new Date()
  });
  await project.save();
  await timelineForProject(project, "project_photo_added", "Project photo added", { category: params.category, room: params.room });
  return project;
}

export async function submitQaReview(params: {
  projectId: string;
  checklist: Array<{ key: string; status: ChecklistStatus; remarks?: string }>;
  inspectedBy?: string;
  remarks?: string;
}) {
  const project = await Project.findById(params.projectId);
  if (!project) throw new Error("Project not found.");
  const checklist = project.qa.checklist.map((item) => {
    const update = params.checklist.find((entry) => entry.key === item.key);
    return {
      key: item.key,
      label: item.label,
      status: update?.status || item.status,
      remarks: update?.remarks || item.remarks
    };
  });
  const passed = checklist.filter((item) => item.status === "passed").length;
  const failed = checklist.some((item) => item.status === "failed");
  project.qa = {
    checklist,
    score: Math.round((passed / Math.max(checklist.length, 1)) * 100),
    status: failed ? "failed" : "passed",
    inspected_by: params.inspectedBy,
    remarks: params.remarks,
    inspected_at: new Date()
  };
  project.status = failed ? "qa" : "customer_review";
  project.completion_percentage = failed ? 91 : 95;
  project.stages.push({ stage: project.status, timestamp: new Date(), updated_by: params.inspectedBy, remarks: params.remarks });
  await project.save();
  await timelineForProject(project, failed ? "qa_failed" : "qa_passed", failed ? "QA failed" : "QA passed", { score: project.qa.score });
  if (!failed) await notifyProject(project, "ready_for_review", "Ready for review", `${project.project_number} is ready for customer review.`);
  return project;
}

export async function submitCustomerApproval(params: {
  projectId: string;
  customerId: string;
  status: "approved" | "corrections_requested";
  comments?: string;
  rating?: number;
  digitalAcceptance?: boolean;
}) {
  const project = await Project.findById(params.projectId);
  if (!project) throw new Error("Project not found.");
  if (project.customer_id && project.customer_id !== params.customerId) throw new Error("You cannot update this project.");
  project.customer_approval = {
    status: params.status,
    comments: params.comments,
    rating: params.rating,
    digital_acceptance: params.digitalAcceptance,
    accepted_by: params.customerId,
    accepted_at: new Date()
  };
  if (params.status === "approved") {
    project.status = "completed";
    project.completion_percentage = 100;
    project.actual_completion = new Date();
    project.stages.push({ stage: "completed", timestamp: new Date(), updated_by: params.customerId, remarks: "Customer approved installation." });
  } else {
    project.status = "customer_review";
  }
  await project.save();
  await timelineForProject(project, params.status === "approved" ? "project_completed" : "corrections_requested", params.status === "approved" ? "Project completed" : "Corrections requested", { rating: params.rating });
  if (params.status === "approved") await notifyProject(project, "project_completed", "Project completed", `${project.project_number} has been approved by the customer.`);
  return project;
}

export async function generateProjectHandover(projectId: string, updatedBy?: string) {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found.");
  const completedRooms = project.rooms.filter((room) => ["completed", "quality_passed", "customer_approved"].includes(room.status));
  project.status = "handover";
  project.completion_percentage = 100;
  project.actual_completion = project.actual_completion || new Date();
  project.handover = {
    certificate_number: project.handover.certificate_number || createNumber("ABH"),
    project_summary: `${project.project_number} completed with ${completedRooms.length}/${project.rooms.length} rooms ready.`,
    installed_devices_summary: project.checklist.filter((item) => item.status === "passed").map((item) => item.label).join(", "),
    room_summary: completedRooms.map((room) => `${room.room}: ${room.status}`).join("; "),
    completion_date: project.actual_completion,
    ready_for_warranty: true,
    generated_at: new Date()
  };
  project.stages.push({ stage: "handover", timestamp: new Date(), updated_by: updatedBy, remarks: "Project handover generated." });
  await project.save();
  await timelineForProject(project, "handover_generated", "Project handover generated", { certificate_number: project.handover.certificate_number });
  await notifyProject(project, "project_completed", "Project handover ready", `${project.project_number} handover is ready.`);
  return project;
}

export async function getProjectAnalytics() {
  const [total, completed, delayed, projects, engineers] = await Promise.all([
    Project.countDocuments({}),
    Project.countDocuments({ status: { $in: ["completed", "handover"] } }),
    Project.countDocuments({ expected_completion: { $lt: new Date() }, status: { $nin: ["completed", "handover", "cancelled"] } }),
    Project.find({}).select("completion_percentage actual_completion created_at qa customer_approval primary_engineer_id").limit(500),
    Engineer.find({}).select("name assigned_project_ids performance").limit(100)
  ]);
  const completionTimes = projects
    .filter((project) => project.actual_completion)
    .map((project) => Math.ceil(((project.actual_completion as Date).getTime() - project.created_at.getTime()) / (24 * 60 * 60 * 1000)));
  const ratings = projects
    .map((project) => project.customer_approval?.rating)
    .filter((rating): rating is number => typeof rating === "number");
  const qaScores = projects.map((project) => project.qa?.score).filter((score): score is number => typeof score === "number");
  return {
    totalProjects: total,
    completedProjects: completed,
    delayedProjects: delayed,
    averageCompletionTimeDays: completionTimes.length
      ? Math.round(completionTimes.reduce((sum, days) => sum + days, 0) / completionTimes.length)
      : 0,
    averageCompletionPercentage: projects.length
      ? Math.round(projects.reduce((sum, project) => sum + (project.completion_percentage || 0), 0) / projects.length)
      : 0,
    averageCustomerRating: ratings.length ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10 : 0,
    averageQaScore: qaScores.length ? Math.round(qaScores.reduce((sum, score) => sum + score, 0) / qaScores.length) : 0,
    engineerProductivity: engineers.map((engineer) => ({
      engineerId: engineer._id.toString(),
      name: engineer.name,
      assignedProjects: engineer.assigned_project_ids?.length || 0,
      completedProjects: engineer.performance?.completed_projects || 0,
      averageRating: engineer.performance?.average_rating || 0
    }))
  };
}
