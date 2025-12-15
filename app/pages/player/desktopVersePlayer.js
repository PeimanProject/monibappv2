"use client";

import { Box, Container } from "@mui/material";
import React, { useEffect } from "react";
import { DesktopPlayerControl } from "./desktopPlayerControl";
import { DesktopPlayerTools } from "./desktopPlayerTools";
import { useNavBarStore } from "@/store/layout/useNavBarStore";
import { getLinks } from "../series/desktopSeries";
import { DesktopQuranLecture } from "./desktopQuranLecture";
import { useTranslations } from "next-intl";
import { digitsEnToFa } from "@persian-tools/persian-tools";

export const DesktopVersePlayer = ({
  quranData,
  series,
  seriesId,
  verseId,
  verse,
}) => {
  const [media, setMedia] = React.useState("sound");
  const [index, setIndex] = React.useState(0);
  const t = useTranslations("Lecture");

  // React.useEffect(() => {
  //   if (!!verseId) {
  //     scroller.scrollTo(`verse-${verseId}`, {
  //       offset: 400,
  //     });
  //   }
  // }, [verseId]);

  const handleChange = React.useCallback(
    (value, index) => () => {
      setMedia(value);
      setIndex(index);
    },
    []
  );

  const { setNavBar } = useNavBarStore();

  useEffect(() => {
    setNavBar({
      links: [
        ...getLinks(1),
        // {
        //   title: series?.title,
        //   href: `/series/${series?.id}`,
        // },
      ],
      title: `${series?.title} ${t("verse")} ${digitsEnToFa(verseId)}`,
    });
  }, [setNavBar, series?.title, series?.id]);

  return (
    <Box sx={{ py: 1 }}>
      <Container maxWidth="lg" sx={{ display: "flex", mt: 2 }}>
        <Box sx={{ flex: 1 }}>
          <DesktopQuranLecture
            quranData={quranData}
            lectureList={series?.lectureList}
            seriesId={seriesId}
            verseId={verseId}
          />
        </Box>
        <Box sx={{ mx: 2 }} />

        <Box sx={{ flex: 1, position: "sticky", top: 90, alignSelf: "flex-start" }}>
          <DesktopPlayerControl
            media={media}
            {...verse}
            verse
            series={series}
            seriesId={seriesId}
            verseId={verseId}
            onChange={handleChange}
            index={index}
          />
          <DesktopPlayerTools {...verse} />
        </Box>
      </Container>
    </Box>
  );
};
