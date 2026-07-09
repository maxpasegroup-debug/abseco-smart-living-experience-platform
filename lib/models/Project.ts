import { Model, Schema, model, models } from "mongoose";

export type ProjectStatus =
  | "project_created"
  | "planning"
  | "material_ordered"
  | "material_ready"
  | "engineer_assigned"
  | "visit_scheduled"
  | "visit_completed"
  | "installation_started"
  | "lighting"
  | "curtains"
  | "security"
  | "automation"
  | "testing"
  | "qa"
  | "customer_review"
  | "completed"
  | "handover"
  | "cancelled";

export type ProjectPriority = "Low" | "Medium" | "High" | "Urgent";
export type RoomProgressStatus = "pending" | "in_progress" | "completed" | "quality_passed" | "customer_approved";
export type ChecklistStatus = "pending" | "passed" | "failed" | "not_applicable";
export type PhotoCategory = "before" | "during" | "after" | "testing" | "completion";

export type ProjectStageEvent = {
  stage: ProjectStatus;
  timestamp: Date;
  updated_by?: string;
  remarks?: string;
};

export type EngineerAssignmentHistory = {
  engineer_id?: string;
  engineer_name?: string;
  role?: string;
  action: "assigned" | "reassigned" | "removed";
  updated_by?: string;
  remarks?: string;
  timestamp: Date;
};

export type ProjectRoomProgress = {
  room: string;
  status: RoomProgressStatus;
  completion_percentage: number;
  remarks?: string;
  updated_by?: string;
  updated_at: Date;
};

export type ProjectChecklistItem = {
  key: string;
  label: string;
  status: ChecklistStatus;
  remarks?: string;
  updated_by?: string;
  updated_at?: Date;
};

export type ProjectPhoto = {
  url: string;
  room?: string;
  engineer_id?: string;
  engineer_name?: string;
  category: PhotoCategory;
  caption?: string;
  uploaded_at: Date;
};

export type ProjectQaItem = {
  key: string;
  label: string;
  status: ChecklistStatus;
  remarks?: string;
};

export type ProjectQaReview = {
  checklist: ProjectQaItem[];
  score?: number;
  status: "pending" | "passed" | "failed";
  inspected_by?: string;
  remarks?: string;
  inspected_at?: Date;
};

export type CustomerApproval = {
  status: "pending" | "approved" | "corrections_requested";
  comments?: string;
  rating?: number;
  digital_acceptance?: boolean;
  accepted_by?: string;
  accepted_at?: Date;
};

export type ProjectHandover = {
  certificate_number?: string;
  project_summary?: string;
  installed_devices_summary?: string;
  room_summary?: string;
  completion_date?: Date;
  ready_for_warranty: boolean;
  generated_at?: Date;
};

export type ProjectDocument = {
  project_number: string;
  customer_id?: string;
  lead_id?: string;
  planner_plan_id?: string;
  proposal_id?: string;
  order_id?: string;
  sales_executive?: string;
  project_manager?: string;
  primary_engineer_id?: string;
  assistant_engineer_ids?: string[];
  priority: ProjectPriority;
  status: ProjectStatus;
  expected_start?: Date;
  expected_completion?: Date;
  actual_completion?: Date;
  completion_percentage: number;
  remarks?: string;
  stages: ProjectStageEvent[];
  engineer_history: EngineerAssignmentHistory[];
  rooms: ProjectRoomProgress[];
  checklist: ProjectChecklistItem[];
  photos: ProjectPhoto[];
  qa: ProjectQaReview;
  customer_approval: CustomerApproval;
  handover: ProjectHandover;
  created_at: Date;
  updated_at: Date;
};

const stageEventSchema = new Schema<ProjectStageEvent>(
  {
    stage: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    updated_by: { type: String },
    remarks: { type: String }
  },
  { _id: false }
);

const engineerHistorySchema = new Schema<EngineerAssignmentHistory>(
  {
    engineer_id: { type: String },
    engineer_name: { type: String },
    role: { type: String },
    action: { type: String, enum: ["assigned", "reassigned", "removed"], required: true },
    updated_by: { type: String },
    remarks: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const roomProgressSchema = new Schema<ProjectRoomProgress>(
  {
    room: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "quality_passed", "customer_approved"],
      default: "pending"
    },
    completion_percentage: { type: Number, default: 0 },
    remarks: { type: String },
    updated_by: { type: String },
    updated_at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const checklistItemSchema = new Schema<ProjectChecklistItem>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    status: { type: String, enum: ["pending", "passed", "failed", "not_applicable"], default: "pending" },
    remarks: { type: String },
    updated_by: { type: String },
    updated_at: { type: Date }
  },
  { _id: false }
);

const photoSchema = new Schema<ProjectPhoto>(
  {
    url: { type: String, required: true },
    room: { type: String },
    engineer_id: { type: String },
    engineer_name: { type: String },
    category: { type: String, enum: ["before", "during", "after", "testing", "completion"], required: true },
    caption: { type: String },
    uploaded_at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const qaItemSchema = new Schema<ProjectQaItem>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    status: { type: String, enum: ["pending", "passed", "failed", "not_applicable"], default: "pending" },
    remarks: { type: String }
  },
  { _id: false }
);

const qaReviewSchema = new Schema<ProjectQaReview>(
  {
    checklist: { type: [qaItemSchema], default: [] },
    score: { type: Number },
    status: { type: String, enum: ["pending", "passed", "failed"], default: "pending" },
    inspected_by: { type: String },
    remarks: { type: String },
    inspected_at: { type: Date }
  },
  { _id: false }
);

const customerApprovalSchema = new Schema<CustomerApproval>(
  {
    status: { type: String, enum: ["pending", "approved", "corrections_requested"], default: "pending" },
    comments: { type: String },
    rating: { type: Number },
    digital_acceptance: { type: Boolean, default: false },
    accepted_by: { type: String },
    accepted_at: { type: Date }
  },
  { _id: false }
);

const handoverSchema = new Schema<ProjectHandover>(
  {
    certificate_number: { type: String },
    project_summary: { type: String },
    installed_devices_summary: { type: String },
    room_summary: { type: String },
    completion_date: { type: Date },
    ready_for_warranty: { type: Boolean, default: false },
    generated_at: { type: Date }
  },
  { _id: false }
);

const projectSchema = new Schema<ProjectDocument>(
  {
    project_number: { type: String, required: true, unique: true, index: true },
    customer_id: { type: String, index: true },
    lead_id: { type: String, index: true },
    planner_plan_id: { type: String, index: true },
    proposal_id: { type: String, index: true },
    order_id: { type: String, unique: true, sparse: true, index: true },
    sales_executive: { type: String, index: true },
    project_manager: { type: String, index: true },
    primary_engineer_id: { type: String, index: true },
    assistant_engineer_ids: { type: [String], default: [] },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium", index: true },
    status: {
      type: String,
      enum: [
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
      ],
      default: "project_created",
      index: true
    },
    expected_start: { type: Date },
    expected_completion: { type: Date },
    actual_completion: { type: Date },
    completion_percentage: { type: Number, default: 0 },
    remarks: { type: String },
    stages: { type: [stageEventSchema], default: [] },
    engineer_history: { type: [engineerHistorySchema], default: [] },
    rooms: { type: [roomProgressSchema], default: [] },
    checklist: { type: [checklistItemSchema], default: [] },
    photos: { type: [photoSchema], default: [] },
    qa: { type: qaReviewSchema, default: () => ({ checklist: [], status: "pending" }) },
    customer_approval: { type: customerApprovalSchema, default: () => ({ status: "pending", digital_acceptance: false }) },
    handover: { type: handoverSchema, default: () => ({ ready_for_warranty: false }) }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

projectSchema.index({ status: 1, expected_completion: 1 });
projectSchema.index({ primary_engineer_id: 1, status: 1 });

export const Project: Model<ProjectDocument> =
  models.Project || model<ProjectDocument>("Project", projectSchema);
