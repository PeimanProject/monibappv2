"use client";

import { Box, Container } from "@mui/material";
import React, { useEffect } from "react";
import { DesktopTextList } from "@/app/component/quran/desktopTextList";
import { useNavBarStore } from "@/store/layout/useNavBarStore";

export const QuranText = ({ quranData, surahId, surahName }) => {
  const { setNavBar } = useNavBarStore();

  useEffect(() => {
    setNavBar({
      links: [
        { title: "قرآن کریم", href: `content/quran?type=miskat` },
        // [
        //   {
        //     title: surahName?.fa,
        //     href: `quran/${surahId}/${surahName?.fa}?type=miskat`,
        //   },
        // ],
      ],
      title: surahName?.fa,
    });
  }, [setNavBar, surahName]);

  
  return (
    <Box sx={{ py: 1 }}>
      <Container maxWidth={"md"} sx={{ pt: 1 }}>
        <Box
          sx={{
            display: "flex",
            width: 1 / 1,
            mt: 2,
            justifyContent: "center",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <DesktopTextList
              surahId={surahId}
              surahName={surahName}
              data={quranData}
              type="miskat"
              desktop
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
