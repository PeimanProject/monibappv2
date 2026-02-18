"use client";

import {
  Box,
  ButtonBase,
  IconButton,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import React from "react";
import _ from "lodash";
import "../../../plugins/time.extended";
import Image from "next/image";
import {
  useCurrentPositionStore,
  useSoundControlStore,
  useVideoControlStore,
} from "@/store/player/usePlayerStore";

const TitleControl = ({ title, start_time, selected = false }) => {
  const theme = useTheme();
  const audio = useSoundControlStore((state) => state.audio);
  const video = useVideoControlStore((state) => state.video);

  const handleTitleClick = React.useCallback(() => {

    if (!!audio) {
      audio.currentTime = start_time;
    }
    if (video) {
      video.currentTime = start_time;
    }
  }, [audio, video]);

  return (
    <ButtonBase
      component="div"
      onClick={handleTitleClick}
      sx={{
        minHeight: 46,
        justifyContent: "flex-start",
        alignItems: "center",
        display: "flex",
        width: 1 / 1,
        px: 1,
        py: 1,
        borderBottom: 1,
        borderColor: (theme) =>
          theme.palette.mode === "dark" ? "primary.dark" : "primary.main",
      }}
    >
      {!!selected && (
        <Image
          alt="Play"
          width={12}
          height={12}
          src={`/icons/${theme.palette.mode}/play-c.svg`}
        />
      )}
      <Typography
        sx={{
          ...(!!selected && {
            color: (theme) => alpha(theme.palette.primary.dark, 0.8),
            fontWeight: "bold",
            ml: 1,
            // py: 0.5,
            // px: 2,
            // borderRadius: 12,
            // bgcolor: "grey.100",
          }),
        }}
        variant="caption"
        component={"div"}
      >
        {title}
      </Typography>
      {/* {item.categoryId === 1 && (
        <Box
          sx={{
            mx: 1,
            fontSize: 9,
            px: 1,
            py: 0.2,
            color: "white",
            bgcolor: "primary.main",
            borderRadius: 3,
          }}
        >
          {dic.terminology}
        </Box>
      )} */}
      <Box sx={{ flex: 1 }} />
      <IconButton
      // onClick={handlePlaylist({ show: true, topicId: item.id })}
      >
        <Image
          alt="Share Icon"
          src={`/icons/${theme.palette.mode}/playlist.svg`}
          width={18}
          height={18}
        />
      </IconButton>
      <IconButton>
        <Image
          alt="Share Icon"
          src={`/icons/${theme.palette.mode}/share.svg`}
          width={18}
          height={18}
        />
      </IconButton>
    </ButtonBase>
  );
};

export const SubjectList = ({ list, lectureId, title }) => {
  const theme = useTheme();
  const position = useCurrentPositionStore((state) => state.current);

  //const [share, setShare] = React.useState(false);
  //const [currentSubject, setCurrentSubject] = React.useState(null);

  // const handleShare = (open, subject) => (e) => {
  //   setShare(open);
  //   setCurrentSubject(subject);
  //   e.stopPropagation();
  // };

  // const handlePlaylist = React.useCallback(
  //   ({ show, topicId }) =>
  //     (event) => {
  //       event?.stopPropagation();
  //       setShowPlaylist({ show, topicId });
  //     },
  //   [setShowPlaylist]
  // );

  const handleShare = React.useCallback(
    ({ startPosition, ...item }) =>
      async () => {
        // await navigator.share({
        //   // title: dic.title,
        //   text: `${title} ${item.title}\n`,
        //   url: `https://${getCurrentDomain()}/player?id=${lectureId}/&goto=${startPosition}`,
        // });
      },
    [title, lectureId]
  );

  return (
    <>
      {/* <SelectedPlaylist
        topicId={topicId}
        show={show || false}
        onClose={handlePlaylist({ show: false })}
      /> */}
      {/* <ShareControl
        link={`player/${lectureId}/?goto=${currentSubject?.startPosition}`}
        open={share}
        text={`${title} %0a ${currentSubject?.title} %0a%0a ${dic.title}`}
        toggleDialog={handleShare(false)}
      /> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: 1 / 1,
          mt: 2,
        }}
      >
        {_.map(list, (item, index) => (
          <TitleControl
            key={index}
            {...item}
            selected={position >= item.start_time && position <= item.end_time}
          />
        ))}
      </Box>
    </>
  );
};
