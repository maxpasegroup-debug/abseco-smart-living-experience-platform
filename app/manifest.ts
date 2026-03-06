import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ABSECO Smart Living Experience Platform",
    short_name: "ABSECO",
    description: "Mobile-first PWA for exploring AI smart home experiences.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#FF6A00",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml"
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml"
      }
    ]
  };
}
