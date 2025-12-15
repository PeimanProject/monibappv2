"use client";

import React from "react";
import { MainButton } from "@/app/component/mainButton";
import {
  MiskatMonib,
  QuranMonib,
} from "@/app/fragment/mainButtonsList/desktopMainButtonsList";

import { Grid, useTheme, Box, Typography } from "@mui/material";
import Image from "next/image";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useTranslations } from "next-intl";
import { Timer } from "@/app/component/timer";
import { useAuthLoginStore } from "@/store/layout/useProfileStore";
import { usePlayListStore } from "@/store/usePlayListStore";
import { useUserStore } from "@/store/useUserStore";
import { MobileHomeLastLecture } from "@/app/fragment/homeLastLecture/mobileHomeLastLecture";

export default function DesktopPage({ data, list }) {
  const t = useTranslations("Main");
  const tItems = useTranslations("Items");
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
    <Grid container spacing={1}>
      <Grid size={12}>
        <MainButton
          title={t("Quran")}
          link={"content/quran"}
          border
          back={"b1.png"}
          textIcon={`/icons/${theme.palette.mode}/quran.svg`}
          fullWidth
          info={digitsEnToFa(`${data.count["1"]?.count} ${t("lecture")}`)}
        />
        <MainButton
          title={t("Nhj")}
          border
          link={"content/nahjAlBalagha"}
          back={"b2.png"}
          textIcon={`/icons/${theme.palette.mode}/nhj.svg`}
          fullWidth
          info={digitsEnToFa(`${data.count["3"]?.count} ${t("lecture")}`)}
        />
        <MainButton
          title={t("Shf")}
          border
          link={"content/sahifaSajjadiya"}
          back={"b3.png"}
          textIcon={`/icons/${theme.palette.mode}/sahifa.svg`}
          fullWidth
          info={digitsEnToFa(`${data.count["4"]?.count} ${t("lecture")}`)}
        />
        <MainButton
          title={t("Sp")}
          border
          fullWidth
          link={"content/specialLectures"}
          back={"b4.png"}
          textIcon={`/icons/${theme.palette.mode}/sp.svg`}
          info={digitsEnToFa(`${data.count["5"]?.count} ${t("lecture")}`)}
        />
      </Grid>

      <Grid size={6}>
        <QuranMonib />
      </Grid>
      <Grid size={6}>
        <MiskatMonib />
      </Grid>
      <Grid size={3}>
        <MainButton
          fullWidth
          bgcolor="var(--event-color)"
          text={tItems("calendar")}
          link="calendar"
        />
      </Grid>
      <Grid size={3}>
        <MainButton
          fullWidth
          bgcolor={
            !!data.liveCounter?.time || data.isLive
              ? "var(--live-color)"
              : "#555555"
          }
          text={tItems("live")}
          link="live"
        >
          {!!data.liveCounter?.time ? (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ mr: 1 }} variant="caption">
                  {tLive("toLive")}:
                </Typography>
                <Timer pure time={data.liveCounter?.time} />
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                {tItems("live")}
              </Typography>
              <Image src="/icons/live.svg" alt="live" width={30} height={30} />
            </Box>
          )}
        </MainButton>
      </Grid>
      <Grid size={2}>
        <MainButton
          border
          fullWidth
          link={`/wisdom`}
          icon={`/icons/${theme.palette.mode}/wisdom.svg`}
          text={tItems("wisdom")}
        />
      </Grid>
      <Grid size={2}>
        <MainButton
          border
          fullWidth
          onClick={handlePlayListClick(true)}
          icon={`/icons/${theme.palette.mode}/playlist.svg`}
          text={tItems("playlist")}
        />
      </Grid>
      <Grid size={2}>
        <MainButton
          fullWidth
          border
          link={"search"}
          icon={`/icons/${theme.palette.mode}/find.svg`}
          text={tItems("Search")}
        />
      </Grid>
      <Grid size={12}>
        <MobileHomeLastLecture list={list} />
      </Grid>
    </Grid>
  );
}
