export type CollectionItem = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  accent?: string;
};

export type FeaturedProduct = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
};

export type CollectionExperience = {
  id: string;
  title: string;
  description: string;
  image: string;
  type: "lighting" | "curtains" | "voice" | "entertainment" | "security" | "climate";
};

export const collections: CollectionItem[] = [
  {
    id: "luxury-living-room",
    slug: "living-room",
    title: "Luxury Living Room",
    subtitle: "Ambient lighting, curtains, voice",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    accent: "#FF6A00"
  },
  {
    id: "smart-bedroom",
    slug: "bedroom",
    title: "Smart Bedroom",
    subtitle: "Circadian lighting, climate, scenes",
    image: "https://images.unsplash.com/photo-1616594039964-3be75c27176d",
    accent: "#3B82F6"
  },
  {
    id: "smart-kitchen",
    slug: "kitchen",
    title: "Smart Kitchen",
    subtitle: "Lighting, energy, voice workflows",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
    accent: "#10B981"
  },
  {
    id: "home-theatre",
    slug: "home-theatre",
    title: "Home Theatre",
    subtitle: "Cinema mode, sound, lighting",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    accent: "#8B5CF6"
  },
  {
    id: "villa-automation",
    slug: "villa",
    title: "Villa Automation",
    subtitle: "Full-home intelligence",
    image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1",
    accent: "#F59E0B"
  },
  {
    id: "smart-security",
    slug: "security",
    title: "Smart Security",
    subtitle: "Cameras, access, monitoring",
    image: "https://images.unsplash.com/photo-1558002038-10559092a2d4",
    accent: "#EF4444"
  }
];

export const featuredProducts: FeaturedProduct[] = [
  {
    id: "smart-lighting",
    title: "Smart Lighting",
    description: "Mood and scene control for every room",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
    category: "Lighting"
  },
  {
    id: "smart-curtains",
    title: "Smart Curtains",
    description: "Automated shades and natural light",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    category: "Comfort"
  },
  {
    id: "smart-switch",
    title: "Smart Switch Panels",
    description: "Elegant control at your fingertips",
    image: "https://images.unsplash.com/photo-1558002038-10559092a2d4",
    category: "Control"
  },
  {
    id: "security-cameras",
    title: "Smart Security Cameras",
    description: "Peace of mind, beautifully designed",
    image: "https://images.unsplash.com/photo-1558002038-10559092a2d4",
    category: "Security"
  },
  {
    id: "voice-control",
    title: "Voice Control Systems",
    description: "Control your home naturally",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    category: "Voice"
  }
];

export const collectionExperiences: Record<string, CollectionExperience[]> = {
  "living-room": [
    { id: "lr-1", title: "Lighting Scenes", description: "Warm, cool, and ambient presets", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64", type: "lighting" },
    { id: "lr-2", title: "Curtain Automation", description: "Sync with time and mood", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7", type: "curtains" },
    { id: "lr-3", title: "Voice Control", description: "Hands-free commands", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", type: "voice" },
    { id: "lr-4", title: "Entertainment", description: "Movie and music modes", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c", type: "entertainment" }
  ],
  "bedroom": [
    { id: "br-1", title: "Circadian Lighting", description: "Wake and wind down naturally", image: "https://images.unsplash.com/photo-1616594039964-3be75c27176d", type: "lighting" },
    { id: "br-2", title: "Climate & Curtains", description: "Perfect sleep environment", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7", type: "climate" },
    { id: "br-3", title: "Scene Automation", description: "Good morning and good night", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64", type: "lighting" }
  ],
  "kitchen": [
    { id: "kt-1", title: "Task Lighting", description: "Smart under-cabinet and zones", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64", type: "lighting" },
    { id: "kt-2", title: "Voice & Energy", description: "Hands-free and efficient", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136", type: "voice" }
  ],
  "home-theatre": [
    { id: "ht-1", title: "Cinema Mode", description: "Lights dim, screen on", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c", type: "entertainment" },
    { id: "ht-2", title: "Sound & Lighting", description: "Immersive experience", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64", type: "lighting" }
  ],
  "villa": [
    { id: "vl-1", title: "Full-Home Lighting", description: "Every room in sync", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64", type: "lighting" },
    { id: "vl-2", title: "Security & Access", description: "Gates, doors, cameras", image: "https://images.unsplash.com/photo-1558002038-10559092a2d4", type: "security" },
    { id: "vl-3", title: "Climate & Scenes", description: "Zones and schedules", image: "https://images.unsplash.com/photo-1616594039964-3be75c27176d", type: "climate" }
  ],
  "security": [
    { id: "sc-1", title: "Smart Cameras", description: "AI alerts and monitoring", image: "https://images.unsplash.com/photo-1558002038-10559092a2d4", type: "security" },
    { id: "sc-2", title: "Access Control", description: "Locks and gates", image: "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24", type: "security" }
  ]
};

export const defaultCollectionExperiences = collectionExperiences["living-room"];

export const suggestionPhrases = [
  "This room would look great with mood lighting.",
  "Most customers add smart curtains with smart lighting.",
  "Voice control pairs perfectly with this setup.",
  "Consider adding scene automation for daily routines."
];
