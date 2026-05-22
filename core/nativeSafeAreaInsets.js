"use client";

import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { useEffect } from "react";
import { syncAppSafeAreas } from "@/core/useAppHeaderInset";

if (
  typeof document !== "undefined" &&
  Capacitor.isNativePlatform() &&
  Capacitor.getPlatform() === "android"
) {
  document.documentElement.classList.add("capacitor-android");
}

/**
 * Android WebView: ensure --native-safe-bottom is applied before first paint
 * and after resume (MainActivity also pushes via evaluateJavascript).
 */
export function NativeSafeAreaInsets() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "android") {
      return;
    }

    const root = document.documentElement;
    root.classList.add("capacitor-android");

    const readNativePx = (name) => {
      const raw = getComputedStyle(root).getPropertyValue(name).trim();
      const n = parseFloat(raw);
      return Number.isFinite(n) ? n : 0;
    };

    const ensureViewportFitCover = () => {
      let meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "viewport");
        document.head.appendChild(meta);
      }
      const content = meta.getAttribute("content") || "";
      if (!/viewport-fit=cover/i.test(content)) {
        meta.setAttribute(
          "content",
          content
            ? `${content}, viewport-fit=cover`
            : "width=device-width, initial-scale=1, viewport-fit=cover"
        );
      }
    };

    ensureViewportFitCover();

    let resumeHandle;
    (async () => {
      try {
        resumeHandle = await App.addListener("resume", () => {
          ensureViewportFitCover();
        });
      } catch {
        /* optional */
      }
    })();

    const pollId = window.setInterval(() => {
      const bottomOk = readNativePx("--native-safe-bottom") > 0;
      syncAppSafeAreas();
      if (!bottomOk) {
        root.style.setProperty("--native-safe-bottom", "48px");
        syncAppSafeAreas();
      }
      if (bottomOk) {
        window.clearInterval(pollId);
      }
    }, 100);

    const stopPoll = window.setTimeout(() => {
      window.clearInterval(pollId);
    }, 4000);

    return () => {
      window.clearInterval(pollId);
      window.clearTimeout(stopPoll);
      resumeHandle?.remove?.();
    };
  }, []);

  return null;
}
