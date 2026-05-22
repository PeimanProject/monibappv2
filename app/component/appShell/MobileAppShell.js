"use client";

import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { Capacitor } from "@capacitor/core";

/**
 * Optional `--app-shell-height` for when the *visual* viewport is shorter than
 * the layout viewport (mobile browser chrome / iOS keyboard).
 *
 * On Capacitor Android WebView, `visualViewport.height` is often **smaller**
 * than the real drawable height even with no keyboard → letterboxing (white
 * bands). Keyboard there is handled with `adjustResize` on MainActivity, so
 * we skip vv-based height on native Android entirely.
 */
export function MobileAppShell({ header, children, footer }) {
  useEffect(() => {
    const root = document.documentElement;
    const vv = window.visualViewport;
    if (!vv) return;

    const platform = Capacitor.getPlatform();
    const native = Capacitor.isNativePlatform();

    if (native && platform === "android") {
      root.style.removeProperty("--app-shell-height");
      return;
    }

    const syncShellHeight = () => {
      const inner = Math.round(window.innerHeight);
      const vvh = Math.round(vv.height);
      // Keyboard / dynamic UI: visual viewport meaningfully shorter
      if (vvh + 56 < inner) {
        root.style.setProperty("--app-shell-height", `${Math.max(1, vvh)}px`);
      } else {
        root.style.removeProperty("--app-shell-height");
      }
    };

    syncShellHeight();
    vv.addEventListener("resize", syncShellHeight);
    vv.addEventListener("scroll", syncShellHeight);
    window.addEventListener("orientationchange", syncShellHeight);

    return () => {
      vv.removeEventListener("resize", syncShellHeight);
      vv.removeEventListener("scroll", syncShellHeight);
      window.removeEventListener("orientationchange", syncShellHeight);
      root.style.removeProperty("--app-shell-height");
    };
  }, []);

  return (
    <Box
      className="app-shell"
      component="div"
      sx={{
        position: "relative",
        ...(Capacitor.isNativePlatform()
          ? { touchAction: "manipulation" }
          : {}),
      }}
    >
      {header != null ? (
        <Box className="app-shell__header" component="header">
          {header}
        </Box>
      ) : null}
      <Box className="app-shell__main" component="main" id="app-scroll-main">
        {children}
      </Box>
      {footer != null ? (
        <Box className="app-shell__footer" component="footer">
          {footer}
        </Box>
      ) : null}
    </Box>
  );
}
