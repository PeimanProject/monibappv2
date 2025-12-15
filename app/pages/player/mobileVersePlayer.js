"use client";

import React from "react";
import { MobileQuranLecture } from "./mobileQuranLecture";
import { scroller } from "react-scroll";
import { MobileVersePlayerControl } from "./mobileVersePlayerControl";
import _ from "lodash";
import { Container } from "@mui/material"; // اگر از MUI استفاده می‌کنی

export const MobileVersePlayer = ({
  verse,
  series,
  verseId,
  quranData,
  seriesId,
  desktop,
}) => {
  const [media, setMedia] = React.useState("sound");
  const [index, setIndex] = React.useState(0);

 

  React.useEffect(() => {
    if (!!verseId) {
      scroller.scrollTo(`verse-${verseId}`, {
        offset: 400,
      });
    }
  }, [verseId]);

  const handleChange = React.useCallback(
    (value, index) => () => {
      setMedia(value);
      setIndex(index);
    },
    []
  );

  const content = (
    <>
      <MobileVersePlayerControl
        media={media}
        {...verse}
        verse={verse}
        series={series}
        seriesId={seriesId}
        verseId={verseId}
        onChange={handleChange}
        desktop={desktop}
        index={index}
        verseCount={_.filter(quranData, (q) => q.verseId !== 0)?.length}
      />

      {/* <Box sx={{ px: 1 }}>
        <MobilePlayerTools {...verse} />
      </Box> */}

      <MobileQuranLecture
        quranData={quranData}
        lectureList={series?.lectureList}
        seriesId={seriesId}
        verseId={verseId}
        rId={series.rId}
      />
    </>
  );

  return desktop ? <Container maxWidth="md">{content}</Container> : content;
};
