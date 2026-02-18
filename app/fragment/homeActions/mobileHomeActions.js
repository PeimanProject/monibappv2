"use client";

import React from "react";
import { MainButton } from "@/app/component/mainButton";
import { Box, Button, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { desktopValues } from "@/core/config/values";
import Link from "next/link";
import { Timer } from "@/app/component/timer";
import { useTranslate } from "@/core/useTranslation";

export const MobileHomeActions = ({ isConnected, liveCounter, isLive }) => {
  const { get } = useTranslate()
  const theme = useTheme();

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
        {
          isConnected &&
          <Box sx={{ flex: 1, mx: 0.3, a: { height: 1 / 1 } }}>
            <Link href={`/content/quran?type=miskat`}>
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
        }
      </Box>
      {
        isConnected && <Box sx={{ display: "flex" }}>
          <MainButton
            fullWidth
            bgcolor="var(--event-color)"
            text={get("Items.calendar")}
            link="calendar"
          />
          <MainButton
            fullWidth
            bgcolor={
              !!liveCounter?.time || isLive ? "var(--live-color)" : "#555555"
            }
            text={get("Items.live")}
            link="live"
          >
            {!!liveCounter?.time && (
              <Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ mr: 1 }} variant="caption">
                    {get("Live.toLive")}:
                  </Typography>
                  <Timer pure time={liveCounter?.time} />
                </Box>
              </Box>
            )}
            {!liveCounter && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1" sx={{ mr: 1 }}>
                  {get("Items.live")}
                </Typography>
                <Image src="/icons/live.svg" alt="live" width={30} height={30} />
              </Box>
            )}
          </MainButton>
        </Box>
      }

    </>
  );
};
