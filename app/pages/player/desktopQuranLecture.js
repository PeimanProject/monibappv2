"use client";

import { Box } from "@mui/material";
import React from "react";
import { useTranslations } from "next-intl";
import _ from "lodash";
import { TabNormalItem, TabStyle } from "@/app/component/tabStyle";
import { DesktopTextList } from "@/app/component/quran/desktopTextList";
import { DesktopLectureList } from "../series/desktopLectureList";

export const DesktopQuranLecture = ({
  quranData,
  lectureList,
  seriesId,
  verseId,
}) => {
  const [value, setValue] = React.useState("quran");
  const [index, setIndex] = React.useState(0);
  const t = useTranslations("Lecture");

  const handleChange = React.useCallback(
    (value, index) => () => {
      setValue(value);
      setIndex(index);
    },
    []
  );

  return (
    <Box
      sx={{
        mt: 3,
        mb: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TabStyle index={index}>
        <TabNormalItem
          onChange={handleChange}
          value={"quran"}
          index={0}
          selected={value === "quran"}
          text={t("quran")}
        />
        <TabNormalItem
          onChange={handleChange}
          value={"lectures"}
          index={1}
          selected={value === "lectures"}
          text={t("lectures")}
        />
      </TabStyle>
      <Box sx={{ pt: 1, pb: 22, width: 1 / 1 }}>
        {value === "lectures" && (
          <>
            <DesktopLectureList lectureList={lectureList} />
          </>
        )}
        {value === "quran" && (
          <>
            <DesktopTextList data={quranData} seriesId={seriesId} verseId={verseId} />
          </>
        )}
      </Box>
    </Box>
  );
};
