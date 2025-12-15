"use client";

import React from "react";
import { MainButton } from "@/app/component/mainButton";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import { useAuthLoginStore } from "@/store/layout/useProfileStore";
import { usePlayListStore } from "@/store/usePlayListStore";
import { useUserStore } from "@/store/useUserStore";
import { Timer } from "@/app/component/timer";
import Image from "next/image";

export const DesktopHomeActions = ({ liveCounter, isLive }) => {
  const t = useTranslations("Items");
  const tLive = useTranslations("Live");
  const theme = useTheme();
  const user = useUserStore((state) => state.user);
  const setShowLogin = useAuthLoginStore((state) => state.setShow);
  const setShowPlayList = usePlayListStore((state) => state.setShow);

  const handlePlayListClick = React.useCallback(
    (show) => () => {
      if (!!!user) {
        setShowLogin(true);
        return;
      }
      setShowPlayList(show);
    },
    [setShowPlayList, user, setShowLogin]
  );

  return (
    <>
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
          {!!liveCounter?.time ? (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ mr: 1 }} variant="caption">
                  {tLive("toLive")}:
                </Typography>
                <Timer pure time={liveCounter?.time} />
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                {t("live")}
              </Typography>
              <Image src="/icons/live.svg" alt="live" width={30} height={30} />
            </Box>
          )}
        </MainButton>
      </Box>
      <Box sx={{ display: "flex" }}>
        <MainButton
          fullWidth
          link={`/wisdom`}
          icon={`/icons/${theme.palette.mode}/wisdom.svg`}
          text={t("wisdom")}
        />

        <MainButton
          fullWidth
          onClick={handlePlayListClick(true)}
          icon={`/icons/${theme.palette.mode}/playlist.svg`}
          text={t("playlist")}
        />
        <MainButton
          fullWidth
          link={"search"}
          icon={`/icons/${theme.palette.mode}/find.svg`}
          text={t("Search")}
        />
      </Box>
    </>
  );
};
