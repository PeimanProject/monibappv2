"use client";

import { Box, Container, Divider } from "@mui/material";
import React, { useEffect } from "react";
import { DesktopLectureList } from "./desktopLectureList";
import { DesktopTextList } from "@/app/component/quran/desktopTextList";
import { useNavBarStore } from "@/store/layout/useNavBarStore";

export const getLinks = (mainId,type) => {
  switch (mainId) {
    case 1:
      return [{ title: "قرآن کریم", href: `/content/quran?type=${type}` }];
    case 4:
      return [{ title: "صحیفه سجادیه", href: "/content/sahifaSajjadiya" }];
    case 3:
      return [{ title: "نهج البلاغه", href: "/content/nahjAlBalagha" }];
    case 5:
      return [{ title: "گفتارهای ویژه", href: "/content/specialLectures" }];
  }
};

export const DesktopSeries = ({ series, quranData, seriesId, type, os }) => {
  const { setNavBar } = useNavBarStore();


  useEffect(() => {
    setNavBar({
      links: getLinks(series.mainId,type),
      title: series?.title,
    });
  }, [setNavBar, series.mainId]);
  return (
    <Box sx={{ py: 1 }}>
      <Container maxWidth={series?.mainId === 1 ? "lg" : "md"} sx={{ pt: 1 }}>
        <Box
          sx={{
            display: "flex",
            width: 1 / 1,
            mt: 2,
            justifyContent: "center",
          }}
        >
          {type !== "miskat" && (
            <Box
              sx={{
                flex: 1,
              }}
            >
              <DesktopLectureList
                {...series}
                desktop
                lectureCount={series?.lectureList?.length}
                os={os}
              />
            </Box>
          )}
          {series?.mainId === 1 && (
            <>
              {type !== "miskat" && (
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 4, borderColor: "primary.main" }}
                />
              )}
              <Box sx={{ flex: 1 }}>
                <DesktopTextList
                  seriesId={seriesId}
                  type={type}
                  {...series}
                  data={quranData}
                  desktop
                />
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};
