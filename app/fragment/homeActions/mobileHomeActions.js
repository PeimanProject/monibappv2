"use client";

import React from "react";
import { MainButton } from "@/app/component/mainButton";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { desktopValues } from "@/core/config/values";
import Link from "next/link";
import { Timer } from "@/app/component/timer";

export const MobileHomeActions = ({ liveCounter, isLive }) => {
  const t = useTranslations("Items");
  const tLive = useTranslations("Live");
  const theme = useTheme();
  const locale = useLocale();

  return (
    <>
      <Box sx={{ display: "flex", mt: 0.5, alignItems: "stretch" }}>
        <Box sx={{ flex: 1, mx: 0.3 }}>
          <Link target="_blank" href={`https://quran.monibapp.ir`}>
            <Button
              sx={{
                borderRadius: desktopValues({}).BORDER,
                bgcolor:
                  theme.palette.mode === "dark" ? "transparent" : "#00006a",
                ...(theme.palette.mode === "dark" && {
                  borderColor: "primary.dark",
                }),
              }}
              fullWidth
              disableElevation
              variant={theme.palette.mode === "dark" ? "outlined" : "contained"}
            >
              <Image
                alt="Quran Monib"
                src={`/icons/${theme.palette.mode}/quran-monib-mobile.svg`}
                width={140}
                height={40}
              />
            </Button>
          </Link>
        </Box>
        <Box sx={{ flex: 1, mx: 0.3, a: { height: 1 / 1 } }}>
          <Link href={`/${locale}/content/quran?type=miskat`}>
            <Button
              sx={{
                borderRadius: desktopValues({}).BORDER,
                background: "url(/images/miskat.jpg) center center",
                backgroundSize: "cover",
                height: 52,
              }}
              fullWidth
              disableElevation
              variant={theme.palette.mode === "dark" ? "outlined" : "contained"}
            ></Button>
          </Link>
        </Box>
      </Box>
      <Box sx={{ display: "flex" }}>
        <MainButton
          fullWidth
          bgcolor="var(--event-color)"
          text={t("calendar")}
          link="calendar"
        />
        <MainButton
          fullWidth
          bgcolor={
            !!liveCounter?.time || isLive ? "var(--live-color)" : "#555555"
          }
          text={t("live")}
          link="live"
        >
          {!!liveCounter?.time && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ mr: 1 }} variant="caption">
                  {tLive("toLive")}:
                </Typography>
                <Timer pure time={liveCounter?.time} />
              </Box>
            </Box>
          )}
          {!liveCounter && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                {t("live")}
              </Typography>
              <Image src="/icons/live.svg" alt="live" width={30} height={30} />
            </Box>
          )}
        </MainButton>
      </Box>
    </>
  );
};
