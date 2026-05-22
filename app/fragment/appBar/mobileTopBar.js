"use client";

import { Box, Typography, alpha, useTheme, Divider } from "@mui/material";
import Image from "next/image";
import React from "react";
import { desktopValues } from "@/core/config/values";
import Link from "next/link";
import { useVerseDataStore } from "@/store/useVerseData";

const TOOLBAR_PX = desktopValues({}).APP_HEIGHT;

const Tools = () => {
  const theme = useTheme();
  const { title, subText, mode } = useVerseDataStore();

  return (
    <Box
      component="header"
      className="app-mobile-top-bar"
      sx={{
        position: "relative",
        top: "auto",
        zIndex: (t) => t.zIndex.appBar,
        width: "100%",
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
        paddingTop: "var(--app-header-inset-top, 0px)",
        height: `calc(${TOOLBAR_PX}px + var(--app-header-inset-top, 0px))`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        backgroundColor: (t) =>
          mode === "quran" ? "#bccac4" : alpha(t.palette.background.paper, 1),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: TOOLBAR_PX,
          minHeight: TOOLBAR_PX,
          maxHeight: TOOLBAR_PX,
          px: 2,
          flexShrink: 0,
          ">a": {
            display: "flex",
            alignItems: "center",
            lineHeight: 0,
          },
        }}
      >
        <Link href="/">
          <Image
            src={`/icons/${theme.palette.mode}/monib-text.svg`}
            alt="Monib Text"
            width={100}
            height={30}
            style={{ display: "block" }}
            priority
          />
        </Link>

        {!!title && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: 1,
              a: { color: "text.primary" },
            }}
          >
            <Typography variant="caption">{title}</Typography>
            {!!subText && (
              <>
                <Divider
                  orientation="vertical"
                  sx={{ minHeight: 15, mx: 0.5, transform: "rotate(20deg)" }}
                />
                <Typography variant="caption">{subText}</Typography>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const MobileTopBar = () => <Tools />;
