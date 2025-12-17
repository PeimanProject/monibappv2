"use client";

import { MainButton } from "@/app/component/mainButton";
import { desktopValues } from "@/core/config/values";
import { Box, useTheme } from "@mui/material";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import Link from "next/link";
import React from "react";
import { useTranslations } from "use-intl";

export const QuranMonib = () => {
  const theme = useTheme();

  return (
    <Box href="https://quran.monibapp.ir/" component={"a"}>
      <Box
        sx={{
          height: 60,
          bgcolor: "#000067",
          borderRadius: desktopValues({}).BORDER,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component={"img"}
          src={`/icons/${theme.palette.mode}/quran-monib.svg`}
          sx={{ objectFit: "cover", width: "70%" }}
        />
      </Box>
    </Box>
  );
};

export const MiskatMonib = () => {
  return (
    <Link href={"/content/quran/?type=miskat"}>
      <Box
        sx={{
          height: 60,
          bgcolor: "#092137",
          borderRadius: desktopValues({}).BORDER,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          component={"img"}
          src={`/miskat.jpg`}
          sx={{ objectFit: "contain", width: "100%" }}
        />
      </Box>
    </Link>
  );
};

export const DesktopMainButtonsList = ({ data }) => {
  const t = useTranslations("Main");
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <MainButton
        title={t("Quran")}
        link={"content/quran"}
        back={"b1.png"}
        textIcon={`/icons/${theme.palette.mode}/quran.svg`}
        fullWidth
        info={digitsEnToFa(`${data["1"]?.count} ${t("lecture")}`)}
      />
      <MainButton
        title={t("Nhj")}
        back={"b2.png"}
        link={"content/nahjAlBalagha"}
        textIcon={`/icons/${theme.palette.mode}/nhj.svg`}
        fullWidth
        info={digitsEnToFa(`${data["3"]?.count} ${t("lecture")}`)}
      />
      <MainButton
        title={t("Shf")}
        back={"b3.png"}
        link={"content/sahifaSajjadiya"}
        textIcon={`/icons/${theme.palette.mode}/sahifa.svg`}
        fullWidth
        info={digitsEnToFa(`${data["4"]?.count} ${t("lecture")}`)}
      />
      <MainButton
        title={t("Sp")}
        back={"b4.png"}
        fullWidth
        link={"content/specialLectures"}
        textIcon={`/icons/${theme.palette.mode}/sp.svg`}
        info={digitsEnToFa(`${data["5"]?.count} ${t("lecture")}`)}
      />
      <QuranMonib />
      <MiskatMonib />
    </Box>
  );
};
