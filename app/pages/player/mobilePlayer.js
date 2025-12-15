"use client";

import React from "react";
import { MobilePlayerControl } from "./mobilePlayerControl";
import { Box } from "@mui/material";
import { MobilePlayerTools } from "./mobilePlayerTools";
import { MobilePlayerAI } from "./mobilePlayerAI";
import { MobileSubjectText } from "./mobileSubjectText";

export const MobilePlayer = ({
  lecture,
  quranData,
  srtArr,
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

  return (
    <>
      <MobilePlayerControl
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
      <Box sx={{ px: 1 }}>
        <MobilePlayerTools {...lecture} os={os} />
        {!!lecture?.srt?.fileName && (
          <MobilePlayerAI
            {...lecture}
            srtArray={{
              fa: srtArr?.subtitlesData,
              en: srtEnArr?.subtitlesData,
            }}
          />
        )}
      </Box>
      <MobileSubjectText
        {...lecture}
        quranData={quranData}
        seriesId={lecture?.seriesId}
        position="player"
      />
    </>
  );
};
