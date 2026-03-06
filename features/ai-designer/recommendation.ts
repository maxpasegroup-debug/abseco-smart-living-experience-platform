import { DesignerInput } from "@/lib/types";
import { formatCurrencyRange } from "@/lib/utils/format";

export function generateRecommendation(input: DesignerInput) {
  const packageName =
    input.priority === "Security"
      ? "Security Home"
      : input.priority === "Luxury" && input.homeType === "Villa"
        ? "AI Villa"
        : input.priority === "Entertainment"
          ? "Luxury Home"
          : "Comfort Home";

  return {
    packageName,
    estimatedRange: formatCurrencyRange(input.budget),
    features: [
      "Room-level automation orchestration",
      "Voice + app based controls",
      "Scene automation with scheduling"
    ]
  };
}
