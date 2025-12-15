"use client";

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { red as Error } from "@mui/material/colors";
import { ModernComponent } from "./modernComponents";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import useMediaQuery from "@mui/material/useMediaQuery";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import GlobalStyles from "@mui/material/GlobalStyles";
import _ from "lodash";

import {
  blue,
  blueGrey,
  yellow,
  red,
  green,
  pink,
  purple,
  deepPurple,
  indigo,
  lightBlue,
  cyan,
  teal,
  lightGreen,
  lime,
  amber,
  orange,
  deepOrange,
} from "@mui/material/colors";
import { useThemeModeStore } from "@/store/layout/useThemeModeStore";

export const colorsCode = {
  blue,
  blueGrey,
  yellow,
  red,
  green,
  pink,
  purple,
  deepPurple,
  indigo,
  lightBlue,
  cyan,
  teal,
  lightGreen,
  lime,
  amber,
  orange,
  deepOrange,
};

const darkBackgroundColor = {
  300: {
    paper: "#292929",
    default: "#1e1e1e",
  },
  500: {
    paper: "#292929",
    default: "#1e1e1e",
  },
  700: {
    paper: "#292929",
    default: "#1e1e1e",
  },
  800: {
    paper: "#1e1e1e",
    default: "#1e1e1e",
  },
  900: {
    paper: "#000",
    default: "#000",
  },
};

export const mainLayoutTheme = ({
  mode = "light",
  dir = "ltr",
  colorTheme = "blue",
  shade = 700,
  theme,
  components,
}) =>
  createTheme({
    cssVariables: true,
    direction: dir,
    typography: {
      useNextVariants: true,
      fontFamily: [
        `var(--global-font)`,
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      fontStyle: "normal",
      fontWeight: "normal",
    },
    system: theme,
    palette: {
      mode,
      primary: theme.color || { main: colorsCode[colorTheme][shade] },
      secondary: { main: "#000", dark: "#cc5b1b" },
      divider: mode === "light" ? theme?.colors.divider : "#fff",
      error: { main: Error[400] },
      background:
        mode === "light"
          ? theme?.back || {
            paper: "#fff",
            default: "#f6f8fc",
          }
          : darkBackgroundColor[shade],
    },
    components,
  });

const ctx = {
  modern: ModernComponent,
};

export const StyleProvider = function ({
  children,
  dir = "rtl",
  theme,
  viewport,
}) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  let currentLayoutTheme = useThemeModeStore((state) => state.mode);
  const isHydrated = useThemeModeStore((state) => state.isHydrated);

  if (currentLayoutTheme === "device") {
    currentLayoutTheme = prefersDarkMode ? "dark" : "light";
  }

  const currentTheme = mainLayoutTheme({
    mode: currentLayoutTheme,
    dir,
    shade: 700,
    theme: theme?.theme,
    components: ctx[theme?.theme?.id || "modern"]({
      ...(theme?.theme?.componentParams || { type: "first" }),
    }),
  });

  // const colorObject = theme.theme .colors.reduce((acc, { key, value }) => {
  //   acc[key] = value;
  //   return acc;
  // }, {});

  return (
    <AppRouterCacheProvider
      //value={cacheRtl}
      options={{
        //   enableCssLayer: true,
        key: "css",
        stylisPlugins: dir === "rtl" ? [prefixer, rtlPlugin] : [],
      }}
    >
      {!!isHydrated && (
        <ThemeProvider theme={currentTheme}>
          <GlobalStyles
            styles={(theme) => ({
              // ":root": {
              //   ...colorObject,
              // },
              ":root": {
                "--border-dark-color": "#c7d4ce",
                "--event-color": "#c75f00",
                "--live-color": "#7b0000",
              },
              "body,html": {
                backgroundColor: theme.palette.background.default,
                padding: 0,
                margin: 0,
                fontFamily: "var(--global-font)",
                ...(viewport.isMobile
                  ? {
                    background: `url('/images/back.jpg') center center no-repeat`,
                    backgroundAttachment: `fixed`,
                  }
                  : {}),
              },
              iframe: {
                border: "none",
                overflow: "hidden",
              },
              // "video::cue": {
              //   color: "red",
              // },
              "::-webkit-scrollbar": {
                width: 18,
                height: 18,
              },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: theme.palette.primary.main,
                borderRadius: `20px`,
                border: `6px solid transparent`,
                backgroundClip: `content-box`,
              },
              "::-webkit-scrollbar-thumb:hover": {
                backgroundColor: theme.palette.primary.light,
              },
            })}
          />
          {children}
        </ThemeProvider>
      )}
    </AppRouterCacheProvider>
  );
};