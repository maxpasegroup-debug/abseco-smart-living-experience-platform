import type {
  PlannerAnswers,
  PlannerRecommendation,
  StructuredSmartHomePlan
} from "@/features/planner/types";
import { getPlanFromConfig } from "@/features/configurator/data";

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function has(values: string[], value: string) {
  return values.includes(value);
}

export function generatePlannerRecommendation(answers: PlannerAnswers): PlannerRecommendation {
  const legacyLifestyle =
    has(answers.lifestyles, "Security")
      ? "security-first"
      : has(answers.lifestyles, "Entertainment")
        ? "entertainment-lover"
        : has(answers.lifestyles, "Energy Saving")
          ? "energy-efficient"
          : answers.homeType === "villa" || has(answers.lifestyles, "Luxury")
            ? "luxury-ambience"
            : "full-smart-villa";

  const legacyPlan = getPlanFromConfig({
    homeType: answers.homeType || "apartment",
    rooms: answers.rooms.map((room) => room.toLowerCase().replace(/\s+/g, "-")),
    lifestyle: legacyLifestyle
  });

  const recommendedExperiences = unique([
    ...(has(answers.goals, "Lighting") || has(answers.lifestyles, "Luxury") ? ["Smart Lighting Scenes"] : []),
    ...(has(answers.goals, "Curtains") ? ["Smart Curtain Automation"] : []),
    ...(has(answers.goals, "Cinema") || has(answers.lifestyles, "Entertainment") ? ["Cinema Mode"] : []),
    ...(has(answers.goals, "Security") || has(answers.lifestyles, "Security") ? ["Smart Security"] : []),
    ...(has(answers.goals, "Climate") ? ["Climate Comfort"] : []),
    ...(has(answers.goals, "Voice Control") ? ["Voice Control"] : []),
    ...(has(answers.goals, "Remote Monitoring") ? ["Remote Monitoring"] : []),
    "Scene Automation"
  ]);

  const suggestedAddOns = unique([
    ...(answers.family.children ? ["Child-safe scene controls", "Entry alerts"] : []),
    ...(answers.family.parents ? ["Senior-friendly one-touch scenes", "Emergency alert automation"] : []),
    ...(answers.family.pets ? ["Pet monitoring camera", "Pet-safe climate routine"] : []),
    ...(answers.rooms.includes("Outdoor") ? ["Outdoor security lighting"] : []),
    ...(answers.rooms.includes("Home Office") ? ["Focus mode automation"] : [])
  ]);

  const packageName =
    answers.budget === "Rs 10L+" || answers.homeType === "villa"
      ? "AI Luxury Villa Package"
      : has(answers.lifestyles, "Security")
        ? "Security Smart Home Package"
        : has(answers.lifestyles, "Luxury") || answers.budget === "Rs 5L - Rs 10L"
          ? "Luxury Smart Home Package"
          : "Premium Smart Home Package";

  return {
    packageName,
    recommendedRooms: answers.rooms,
    recommendedExperiences,
    suggestedAddOns,
    estimatedBudgetRange: answers.budget && answers.budget !== "Exploring" ? answers.budget : legacyPlan.estimate,
    futureUpgrades: unique([
      "Full-home orchestration",
      "Energy monitoring",
      ...(answers.homeType === "new-construction" ? ["Pre-wiring consultation"] : []),
      ...(has(answers.goals, "Appliances") ? ["Smart appliance integration"] : [])
    ])
  };
}

export function buildStructuredPlan(
  answers: PlannerAnswers,
  recommendation: PlannerRecommendation
): StructuredSmartHomePlan {
  const homeType = answers.homeType ? answers.homeType.replace(/-/g, " ") : "smart home";
  const members = answers.family.members ? `${answers.family.members} members` : "family needs";

  return {
    homeSummary: `${homeType} planned around ${members}.`,
    lifestyleSummary: answers.lifestyles.length
      ? answers.lifestyles.join(", ")
      : "Balanced smart living",
    selectedRooms: answers.rooms,
    experiences: recommendation.recommendedExperiences,
    recommendedPackage: recommendation.packageName,
    futureUpgradeSuggestions: recommendation.futureUpgrades
  };
}
