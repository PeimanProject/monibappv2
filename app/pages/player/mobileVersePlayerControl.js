"use client";

import { desktopValues, mobileStickyTop } from "@/core/config/values";
import { Box, ButtonBase, Typography } from "@mui/material";
import React from "react";
import ReactPlayer from "react-player";
import _ from "lodash";
import {
  useCCTypeStore,
  useCurrentPositionStore,
  useSoundControlStore,
} from "@/store/player/usePlayerStore";
import { usePlayerActionStore } from "@/store/usePlayerActionStore";
// import Equalizer from "./equalizer";
import { useSyncMediaSourceStore } from "@/store/useSyncMediaSourceStore";
import BackIcon from "@mui/icons-material/ArrowForwardIos";
import ForwardIcon from "@mui/icons-material/ArrowBackIos";
import { useRouter } from "next/navigation";
import { VerseMobileInfo } from "./verseMobileInfo";
import { useVerseDataStore } from "@/store/useVerseData";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useVttTrack } from "@/app/libs/srtHandler";

export const MobileVersePlayerControl = ({
  video,
  media,
  sound,
  lectureId,
  srt,
  srt_en,
  srtArray,
  title,
  index,
  onChange,
  contextName,
  rowNumber,
  description,
  series,
  verseId,
  seriesId,
  verseCount,
  verse,
  desktop,
}) => {
  const faVtt = useVttTrack({
    lectureId,
    filename: srt?.fileName,
  });
  const enVtt = useVttTrack({
    lectureId,
    filename: srt_en?.fileName,
  });
  const [isPlaying, setIsPlaying] = React.useState(false);
  const playerRef = React.useRef(null);
  const [show, setShow] = React.useState(false);
  const [text, setText] = React.useState(null);
  const setAudio = useSoundControlStore((state) => state.setAudio);
  const audioRef = React.useRef(null);
  const ccType = useCCTypeStore((state) => state.type);
  const setPosition = useCurrentPositionStore((state) => state.setPosition);
  const setShowPlayerAction = usePlayerActionStore((state) => state.setShow);
  const { sync, setSync } = useSyncMediaSourceStore((state) => state);
  const [player, setPlayer] = React.useState(null);
  const router = useRouter();

  const { setVerse } = useVerseDataStore();

  React.useEffect(
    () => setVerse(series?.title, `آیه ${digitsEnToFa(verseId)}`),
    [series?.title, verseId]
  );

  React.useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // React.useEffect(() => {
  //   if (!!sync?.[lectureId] && media === "sound") {
  //     audioRef.current.currentTime = sync?.[lectureId];
  //   } else if (!!sync?.[lectureId] && media === "video") {
  //     // player.seekTo(sync?.[lectureId] / 1000);
  //     // console.log("sync?.[lectureId]", sync?.[lectureId], playerRef.current);
  //     playerRef?.current?.seekTo(sync?.[lectureId]);
  //   }
  // }, [media, player]);

  const handleTimeUpdate = React.useCallback(() => {
    const currentTime = audioRef?.current.currentTime;

    setPosition(currentTime);
    setSync({ ...sync, [lectureId]: currentTime });
    if (!!srtArray?.[ccType]) {
      const text = srtArray[ccType].find(
        (caption) =>
          currentTime >= caption?.start && currentTime <= caption?.end
      );
      setText(text?.text);
    }
  }, [srtArray, ccType, setSync, sync]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!!!audio) return;

    setAudio(audio);
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));
    // audio.play();
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioRef?.current, setAudio, handleTimeUpdate]);

  const onReady = React.useCallback(
    (p) => {
      setPlayer(p);
    },
    [setPlayer]
  );

  const handlePictureInPicture = React.useCallback(() => {
    setShowPlayerAction(
      false,
      { title, video: video?.url, sound: sound?.url, lectureId },
      true
    );
    playerRef.current?.getInternalPlayer()?.pause?.();
  }, [setShowPlayerAction, playerRef, video, sound, lectureId, title]);

  const verseAction = (num) => () => {
    router.push(`/verse?seriesId=${seriesId}&verseId=${+verseId + num}`);
  };

  return (
    <>
      <Box
        sx={{
          width: 1 / 1,
          minHeight: media === "video" ? 200 : 150,
          position: "relative",
          bgcolor: "black",
          position: "sticky",
          overflow: "hidden",
          top: mobileStickyTop(desktop),
          // ...(!!!show ||
          //   (media !== "video" && {
          //     background: `url(/images/back-sound.jpg) center`,
          //   })),

          zIndex: 999,
        }}
      >
        {media === "sound" && (
          <Box
            sx={{
              height: 80,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1,
            }}
          >
            {/* <Equalizer
              verse
              audioUrl={sound?.url}
              playing={isPlaying}
              audioRef={audioRef}
            /> */}
            <ButtonBase
              disabled={+verseId === 1}
              onClick={verseAction(-1)}
              sx={{
                color: "white",

                ...(+verseId === 1 && {
                  opacity: 0.5,
                }),
              }}
            >
              <BackIcon fontSize="large" />
              <Typography variant="caption">آیه قبلی</Typography>
            </ButtonBase>
            <Typography
              sx={{
                flex: 1,
                color: "white",
                textAlign: "center",
              }}
              variant="caption"
            >
              {series?.description}
            </Typography>
            <ButtonBase
              disabled={+verseId === verseCount}
              onClick={verseAction(1)}
              sx={{
                color: "white",

                ...(+verseId === verseCount && { opacity: 0.5 }),
              }}
            >
              <Typography variant="caption" sx={{ mr: -1 }}>
                آیه بعدی
              </Typography>
              <ForwardIcon fontSize="large" />
            </ButtonBase>
          </Box>
        )}

        {media === "sound" && (
          <Box
            sx={{
              bgcolor: "background.default",
              borderRadius: (theme) => theme.spacing(3, 3, 0, 0),
              // position: "absolute",
              bottom: 0,
              pt: 0.4,
              width: 1 / 1,
              display: "flex",
              justifyContent: "center",
              audio: {
                width: "calc(100% - 20px)",
                background: "primary.main",
              },
            }}
          >
            <audio
              // component={"audio"}
              controls
              autoPlay
              muted
              ref={audioRef}
              crossOrigin="anonymous"
              preload="metadata"
              onPlay={() => {
                if (audioRef.current?.muted) {
                  audioRef.current.muted = false;
                }
              }}
            // onTimeUpdate={handleTimeUpdate}
            // sx={{
            //   bgcolor: "background.default",
            //   borderRadius: (theme) => theme.spacing(3, 3, 0, 0),
            // }}
            >
              <source src={sound?.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </Box>
        )}

        {/* {!!audioRef?.current && <VoiceVisualizer  />} */}

        {!!show && media === "video" && (
          <ReactPlayer
            ref={playerRef} //
            onReady={onReady}
            config={{
              file: {
                attributes: { playsInline: true },
                tracks: srt
                  ? [
                    {
                      kind: "subtitles",
                      src: faVtt, // Path to your SRT file
                      srcLang: "fa",
                      default: true,
                    },
                    ...(srt_en?.fileName
                      ? [
                        {
                          kind: "subtitles",
                          src: enVtt, // Path to your SRT file
                          srcLang: "en",
                        },
                      ]
                      : []),
                  ]
                  : [],
              },
            }}
            playing={isPlaying}
            // onReady={onReady}
            // onBufferEnd={onBufferEnd}
            // onBuffer={onBuffer}
            height="auto"
            onProgress={(state) => {
              const currentTime = state.playedSeconds;
              setPosition(currentTime);
              setSync({ ...sync, [lectureId]: currentTime * 1 });
            }}
            width={"100%"}
            controls={true}
            url={video?.url}
          />
        )}

        <VerseMobileInfo
          {...{
            contextName,
            rowNumber,
            description,
            onChange,
            series,
            verseId,
            seriesId,
            verse,
            media,
            handlePictureInPicture,
          }}
          media={media}
          index={index}
        />
      </Box>
    </>
  );
};
