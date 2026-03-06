import { AutomationScene, HomeType, PackageItem } from "@/lib/types";

export const homeTypes: HomeType[] = ["Villa", "Apartment", "Office", "Under Construction"];

export const smartPackages: PackageItem[] = [
  {
    id: "comfort-home",
    name: "Comfort Home",
    description: "Lighting, climate and voice control for day-to-day convenience.",
    image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc",
    homeTypes: ["Villa", "Apartment", "Under Construction"],
    estimatedRange: "AED 18,000 - 32,000",
    features: ["Smart lighting", "Climate scenes", "Voice assistant"]
  },
  {
    id: "security-home",
    name: "Security Home",
    description: "AI monitoring, smart locks and perimeter automation.",
    image: "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24",
    homeTypes: ["Villa", "Apartment", "Office"],
    estimatedRange: "AED 26,000 - 45,000",
    features: ["CCTV AI alerts", "Smart access", "Away mode automation"]
  },
  {
    id: "luxury-home",
    name: "Luxury Home",
    description: "Premium automation across ambience, entertainment and comfort.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    homeTypes: ["Villa", "Apartment"],
    estimatedRange: "AED 45,000 - 95,000",
    features: ["Mood scenes", "Cinema control", "Multi-room audio"]
  },
  {
    id: "ai-villa",
    name: "AI Villa",
    description: "Full-stack intelligent home orchestration with predictive scenes.",
    image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1",
    homeTypes: ["Villa", "Under Construction"],
    estimatedRange: "AED 95,000 - 220,000",
    features: ["Predictive routines", "Energy optimization", "Concierge controls"]
  }
];

export const scenes: AutomationScene[] = [
  {
    id: "morning",
    title: "Morning Mode",
    description: "Curtains rise, warm lights fade in, climate adjusts before wake-up."
  },
  {
    id: "movie",
    title: "Movie Mode",
    description: "Lights dim, projector activates, surround profile auto-tunes."
  },
  {
    id: "away",
    title: "Away Mode",
    description: "Doors lock, security arms, and non-essential power optimizes."
  },
  {
    id: "party",
    title: "Party Mode",
    description: "Accent lighting, playlist scenes, and guest climate zones activate."
  }
];
