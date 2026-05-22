"use client";

import { Capacitor } from "@capacitor/core";
import { useEffect } from "react";

function measureEnvInsetPx(edge) {
  if (typeof document === "undefined") return 0;
  const prop =
    edge === "bottom"
      ? "padding-bottom:env(safe-area-inset-bottom,0px);"
      : "padding-top:env(safe-area-inset-top,0px);";
  const probe = document.createElement("div");
  probe.style.cssText = `position:fixed;visibility:hidden;pointer-events:none;${prop}`;
  document.body.appendChild(probe);
  const px = probe.getBoundingClientRect().height;
  probe.remove();
  return px;
}

function measureEnvSafeAreaTopPx() {
  return measureEnvInsetPx("top");
}

function measureEnvSafeAreaBottomPx() {
  return measureEnvInsetPx("bottom");
}

/**
 * One source of truth for header top inset on native Android:
 * prefer env() when WebView reports it; otherwise fall back to --native-safe-top from MainActivity.
 * Never sums env + native (that caused the extra white band).
 */
export function syncAppHeaderInsetTop() {
  const root = document.documentElement;
  const envPx = measureEnvSafeAreaTopPx();
  const nativeRaw = getComputedStyle(root)
    .getPropertyValue("--native-safe-top")
    .trim();
  const nativePx = parseFloat(nativeRaw) || 0;

  let topPx = 0;
  if (envPx > 0) {
    topPx = envPx;
  } else if (nativePx > 0) {
    topPx = nativePx;
  }

  root.style.setProperty("--app-header-inset-top", `${topPx}px`);
  return topPx;
}

/** Bottom inset for padding inside the nav bar — not `bottom` offset (that caused white gap). */
export function syncAppSafeBottom() {
  const root = document.documentElement;
  const envPx = measureEnvSafeAreaBottomPx();
  const nativePx =
    parseFloat(
      getComputedStyle(root).getPropertyValue("--native-safe-bottom").trim()
    ) || 0;

  let bottomPx = 0;
  if (envPx > 0) {
    bottomPx = envPx;
  } else if (nativePx > 0) {
    bottomPx = nativePx;
  } else if (
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === "android"
  ) {
    bottomPx = 48;
  }

  root.style.setProperty("--app-safe-bottom", `${bottomPx}px`);
  return bottomPx;
}

export function syncAppSafeAreas() {
  syncAppHeaderInsetTop();
  syncAppSafeBottom();
}

if (typeof window !== "undefined") {
  window.__syncAppHeaderInsetTop = syncAppSafeAreas;
  window.__syncAppSafeAreas = syncAppSafeAreas;
}

export function NativeHeaderInsetSync() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      syncAppSafeAreas();
      return;
    }

    syncAppSafeAreas();

    if (Capacitor.getPlatform() === "android") {
      document.documentElement.classList.add("capacitor-android");
    }

    const onChange = () => syncAppHeaderInsetTop();
    window.visualViewport?.addEventListener("resize", onChange);
    window.addEventListener("orientationchange", onChange);

    const poll = window.setInterval(() => {
      syncAppSafeAreas();
    }, 250);
    const stop = window.setTimeout(() => window.clearInterval(poll), 5000);

    return () => {
      window.visualViewport?.removeEventListener("resize", onChange);
      window.removeEventListener("orientationchange", onChange);
      window.clearInterval(poll);
      window.clearTimeout(stop);
    };
  }, []);

  return null;
}
