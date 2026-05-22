"use client";

import { Capacitor } from "@capacitor/core";
import {
  SafeArea,
  SystemBarsStyle,
  SystemBarsType,
} from "@capacitor-community/safe-area";
import { useEffect } from "react";

/** Status/navigation bar icon style on native (dark icons on light backgrounds). */
export function NativeSystemBars() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    (async () => {
      try {
        await SafeArea.setSystemBarsStyle({
          style: SystemBarsStyle.Light,
          type: SystemBarsType.StatusBar,
        });
        await SafeArea.setSystemBarsStyle({
          style: SystemBarsStyle.Light,
          type: SystemBarsType.NavigationBar,
        });
      } catch (e) {
        console.warn("NativeSystemBars:", e);
      }
    })();
  }, []);

  return null;
}
