"use client";

import { MainButton } from "@/app/component/mainButton";
import { useTranslate } from "@/core/useTranslation";
import { Box, Grid, useTheme } from "@mui/material";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import React from "react";

export const MobileMainButtonsList = ({ data }) => {
  const { get } = useTranslate()
  const theme = useTheme();

  return (
    <Grid container>
      <Grid size={12}>
        <MainButton
          title={get("Main.Quran")}
          link={"content/quran"}
          center
          back={"b1.png"}
          textIcon={`/icons/${theme.palette.mode}/quran.svg`}
          fullWidth
        // info={digitsEnToFa(`${data["1"]?.count} ${get("Main.lecture")}`)}
        />
      </Grid>
      <Grid size={12}>
        <MainButton
          title={get("Main.Nhj")}
          center
          link={"content/nahjAlBalagha"}
          back={"b2.png"}
          textIcon={`/icons/${theme.palette.mode}/nhj.svg`}
          fullWidth
        // info={digitsEnToFa(`${data["3"]?.count} ${get("Main.lecture")}`)}
        />
      </Grid>
      <Grid size={6}>
        <MainButton
          title={get("Main.Shf")}
          back={"b3.png"}
          link={"content/sahifaSajjadiya"}
          textIcon={`/icons/${theme.palette.mode}/sahifa.svg`}
          center
          fullWidth
          position="bottom"
        // info={digitsEnToFa(`${data["4"]?.count} ${get("Main.lecture")}`)}
        />
      </Grid>
      <Grid size={6}>
        <MainButton
          title={get("Main.Sp")}
          fullWidth
          back={"b4.png"}
          link={"content/specialLectures"}
          textIcon={`/icons/${theme.palette.mode}/sp.svg`}
          center
          position="bottom"
        // info={digitsEnToFa(`${data["5"]?.count} ${get("Main.lecture")}`)}
        />
      </Grid>
    </Grid>
  );
};
