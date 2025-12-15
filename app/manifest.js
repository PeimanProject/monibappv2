import { appConfig } from "@/core/config/values";

export default function manifest() {
  return {
    name: `منیب`,
    short_name:`Monib`,
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
    orientation: "natural",
    scope: "/",
    start_url: "/",
    categories: ["education"],
    description: "سامانه منیب",
    lang: "fa",
    dir: "rtl",
    prefer_related_applications: false,
    related_applications: [],
    shortcuts: [
      {
        name: "Play Audio",
        short_name: "Play",
        description: "Start playing audio content",
        url: "/?audio-session=true",
        icons: [{ src: "/android-icon-96x96.png", sizes: "96x96" }]
      }
    ],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/android-icon-36x36.png",
        sizes: "36x36",
        type: "image/png",
        density: "0.75",
      },
      {
        src: "/android-icon-48x48.png",
        sizes: "48x48",
        type: "image/png",
        density: "1.0",
      },
      {
        src: "/android-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        density: "1.5",
      },
      {
        src: "/android-icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        density: "2.0",
      },
      {
        src: "/android-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        density: "3.0",
      },
      {
        src: "/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        density: "4.0",
      },
    ],
  };
}
