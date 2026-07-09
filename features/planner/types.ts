export type PlannerStatus = "draft" | "completed";

export type PlannerAnswers = {
  homeType?: string;
  rooms: string[];
  lifestyles: string[];
  family: {
    members?: number;
    children?: boolean;
    parents?: boolean;
    pets?: boolean;
  };
  budget?: string;
  goals: string[];
  preferredContactMethod?: "phone" | "whatsapp" | "email" | "video";
  buyingTimeline?: string;
  region?: string;
  campaign?: string;
};

export type PlannerRecommendation = {
  packageName: string;
  recommendedRooms: string[];
  recommendedExperiences: string[];
  suggestedAddOns: string[];
  estimatedBudgetRange: string;
  futureUpgrades: string[];
};

export type StructuredSmartHomePlan = {
  homeSummary: string;
  lifestyleSummary: string;
  selectedRooms: string[];
  experiences: string[];
  recommendedPackage: string;
  futureUpgradeSuggestions: string[];
};

export type PlannerPlan = {
  id?: string;
  status: PlannerStatus;
  currentStep: number;
  answers: PlannerAnswers;
  recommendation?: PlannerRecommendation;
  structuredPlan?: StructuredSmartHomePlan;
  leadId?: string;
  proposalId?: string;
  conversionStatus?: "saved" | "proposal_requested" | "consultation_booked";
  createdAt?: string;
  updatedAt?: string;
};

export const EMPTY_PLANNER_ANSWERS: PlannerAnswers = {
  rooms: [],
  lifestyles: [],
  family: {},
  goals: []
};
