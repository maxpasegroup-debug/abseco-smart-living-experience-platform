export type HomeTypeOption = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

export type RoomOption = {
  id: string;
  title: string;
  image: string;
};

export type LifestyleOption = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

export const homeTypes: HomeTypeOption[] = [
  {
    id: "apartment",
    title: "Apartment",
    subtitle: "Compact smart living",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
  },
  {
    id: "luxury-villa",
    title: "Luxury Villa",
    subtitle: "Full-home intelligence",
    image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1"
  },
  {
    id: "independent-house",
    title: "Independent House",
    subtitle: "Your space, your rules",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
  },
  {
    id: "office",
    title: "Office",
    subtitle: "Smart workspace",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c"
  }
];

export const roomOptions: RoomOption[] = [
  { id: "living-room", title: "Living Room", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3" },
  { id: "bedroom", title: "Bedroom", image: "https://images.unsplash.com/photo-1616594039964-3be75c27176d" },
  { id: "kitchen", title: "Kitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136" },
  { id: "home-theatre", title: "Home Theatre", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c" },
  { id: "outdoor", title: "Outdoor", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
  { id: "security", title: "Security", image: "https://images.unsplash.com/photo-1558002038-10559092a2d4" }
];

export const lifestyleModes: LifestyleOption[] = [
  {
    id: "luxury-ambience",
    title: "Luxury Ambience",
    subtitle: "Mood lighting, scenes, comfort",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea"
  },
  {
    id: "security-first",
    title: "Security First",
    subtitle: "Cameras, access, peace of mind",
    image: "https://images.unsplash.com/photo-1558002038-10559092a2d4"
  },
  {
    id: "entertainment-lover",
    title: "Entertainment Lover",
    subtitle: "Cinema, sound, immersive",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
  },
  {
    id: "energy-efficient",
    title: "Energy Efficient",
    subtitle: "Smart savings, green living",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64"
  },
  {
    id: "full-smart-villa",
    title: "Full Smart Villa",
    subtitle: "Everything, everywhere",
    image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1"
  }
];

export function getPlanFromConfig(config: {
  homeType: string;
  rooms: string[];
  lifestyle: string;
}): { features: string[]; estimate: string } {
  const features = [
    "Smart Lighting",
    "Smart Curtains",
    "Voice Assistant",
    "Security Cameras",
    "Scene Automation"
  ];
  if (config.rooms.includes("home-theatre")) {
    features.push("Home Theatre");
  }
  if (config.rooms.includes("outdoor")) {
    features.push("Outdoor Control");
  }
  if (config.lifestyle === "full-smart-villa") {
    return { features: [...features, "Full-Home Orchestration"], estimate: "₹5L – ₹12L" };
  }
  if (config.lifestyle === "luxury-ambience" || config.homeType === "luxury-villa") {
    return { features, estimate: "₹3.5L – ₹6L" };
  }
  if (config.lifestyle === "security-first") {
    return { features: [...features], estimate: "₹3L – ₹5L" };
  }
  if (config.rooms.length >= 4) {
    return { features, estimate: "₹3L – ₹4.5L" };
  }
  return { features, estimate: "₹2L – ₹3.5L" };
}
