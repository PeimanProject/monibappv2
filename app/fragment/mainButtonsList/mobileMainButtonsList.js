"use client";

import { MainButton } from "@/app/component/mainButton";
import { Box, Grid, useTheme } from "@mui/material";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import React from "react";
import { useTranslations } from "use-intl";

export const MobileMainButtonsList = ({ data }) => {
  const t = useTranslations("Main");
  const theme = useTheme();

  return (
    <Grid container>
      <Grid size={12}>
        <MainButton
          title={t("Quran")}
          link={"content/quran"}
          center
          back={"b1.png"}
          textIcon={`/icons/${theme.palette.mode}/quran.svg`}
          fullWidth
          info={digitsEnToFa(`${data["1"]?.count} ${t("lecture")}`)}
        />
      </Grid>
      <Grid size={12}>
        <MainButton
          title={t("Nhj")}
          center
          link={"content/nahjAlBalagha"}
          back={"b2.png"}
          textIcon={`/icons/${theme.palette.mode}/nhj.svg`}
          fullWidth
          info={digitsEnToFa(`${data["3"]?.count} ${t("lecture")}`)}
        />
      </Grid>
      <Grid size={6}>
        <MainButton
          title={t("Shf")}
          back={"b3.png"}
          link={"content/sahifaSajjadiya"}
          textIcon={`/icons/${theme.palette.mode}/sahifa.svg`}
          center
          fullWidth
          position="bottom"
          info={digitsEnToFa(`${data["4"]?.count} ${t("lecture")}`)}
        />
      </Grid>
      <Grid size={6}>
        <MainButton
          title={t("Sp")}
          fullWidth
          back={"b4.png"}
          link={"content/specialLectures"}
          textIcon={`/icons/${theme.palette.mode}/sp.svg`}
          center
          position="bottom"
          info={digitsEnToFa(`${data["5"]?.count} ${t("lecture")}`)}
        />
      </Grid>
    </Grid>
  );
};
