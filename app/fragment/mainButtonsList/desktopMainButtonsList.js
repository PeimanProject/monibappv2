"use client";

import { MainButton } from "@/app/component/mainButton";
import { desktopValues } from "@/core/config/values";
import { useTranslate } from "@/core/useTranslation";
import { Box, useTheme } from "@mui/material";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import Link from "next/link";
import React from "react";

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
  const { get } = useTranslate()
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <MainButton
        title={get("Main.Quran")}
        link={"content/quran"}
        back={"b1.png"}
        textIcon={`/icons/${theme.palette.mode}/quran.svg`}
        fullWidth
        info={digitsEnToFa(`${data["1"]?.count} ${get("Main.lecture")}`)}
      />
      <MainButton
        title={get("Main.Nhj")}
        back={"b2.png"}
        link={"content/nahjAlBalagha"}
        textIcon={`/icons/${theme.palette.mode}/nhj.svg`}
        fullWidth
        info={digitsEnToFa(`${data["3"]?.count} ${get("Main.lecture")}`)}
      />
      <MainButton
        title={get("Main.Shf")}
        back={"b3.png"}
        link={"content/sahifaSajjadiya"}
        textIcon={`/icons/${theme.palette.mode}/sahifa.svg`}
        fullWidth
        info={digitsEnToFa(`${data["4"]?.count} ${get("Main.lecture")}`)}
      />
      <MainButton
        title={get("Main.Sp")}
        back={"b4.png"}
        fullWidth
        link={"content/specialLectures"}
        textIcon={`/icons/${theme.palette.mode}/sp.svg`}
        info={digitsEnToFa(`${data["5"]?.count} ${get("Main.lecture")}`)}
      />
      <QuranMonib />
      <MiskatMonib />
    </Box>
  );
};
