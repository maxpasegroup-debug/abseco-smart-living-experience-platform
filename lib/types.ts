export type HomeType = "Villa" | "Apartment" | "Office" | "Under Construction";
export type Priority = "Luxury" | "Security" | "Energy saving" | "Entertainment";

export type PackageItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  homeTypes: HomeType[];
  estimatedRange: string;
  features: string[];
};

export type AutomationScene = {
  id: string;
  title: string;
  description: string;
};

export type DesignerInput = {
  homeType: HomeType;
  rooms: number;
  budget: number;
  priority: Priority;
};
