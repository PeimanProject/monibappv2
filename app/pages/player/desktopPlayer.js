"use client";

import { Box, Container } from "@mui/material";
import React, { useEffect } from "react";
import { DesktopPlayerControl } from "./desktopPlayerControl";
import { DesktopSubjectText } from "./desktopSubjectText";
import { DesktopPlayerTools } from "./desktopPlayerTools";
import { useNavBarStore } from "@/store/layout/useNavBarStore";
import { getLinks } from "../series/desktopSeries";
import { digitsEnToFa } from "@persian-tools/persian-tools";


export const DesktopPlayer = ({
  lecture,
  srtArr,
  quranData,
  srtEnArr,
  os,
  mediaCurrent,
  time,
}) => {
  const [media, setMedia] = React.useState("sound");
  const [index, setIndex] = React.useState(0);

 


  React.useEffect(() => {
    if (!!mediaCurrent) {
      setMedia(mediaCurrent);
      setIndex(1);
    }
  }, [mediaCurrent]);

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
        ...getLinks(lecture?.mainId),
        {
          title: lecture?.contextName,
          href: `/series/${lecture?.seriesId}`,
        },
      ],
      title: `جلسه ${digitsEnToFa(lecture?.rowNumber)}`,
    });
  }, [setNavBar, lecture?.title, lecture?.mainId]);

  return (
    <Container maxWidth="lg" sx={{ display: "flex", mt: 2 }}>
      <Box sx={{ flex: 1 }}>
        <DesktopSubjectText
          {...lecture}
          quranData={quranData}
          seriesId={lecture?.seriesId}
          contextId={lecture?.contextId}
          position="player"
        />
      </Box>
      <Box sx={{ mx: 2 }} />

      <Box
        sx={{ flex: 1, position: "sticky", top: 80, alignSelf: "flex-start" }}
      >
        <DesktopPlayerControl
          {...lecture}
          media={media}
          index={index}
          onChange={handleChange}
          time={time}
          srtArray={{
            fa: srtArr?.subtitlesData,
            en: srtEnArr?.subtitlesData,
          }}
        />
        <DesktopPlayerTools
          {...lecture}
          os={os}
          srtArray={{
            fa: srtArr?.subtitlesData,
            en: srtEnArr?.subtitlesData,
          }}
        />
      </Box>
    </Container>
  );
};
