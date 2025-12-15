"use client";

import { desktopValues } from "@/core/config/values";
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import React from "react";
import ReactPlayer from "react-player";
import _ from "lodash";
import {
  useCCTypeStore,
  useCurrentPositionStore,
  useSoundControlStore,
} from "@/store/player/usePlayerStore";
import { usePlayerActionStore } from "@/store/usePlayerActionStore";
import Image from "next/image";
import Equalizer from "./equalizer";
import { useSyncMediaSourceStore } from "@/store/useSyncMediaSourceStore";
import { DesktopInfo } from "./desktopInfo";

export const DesktopPlayerControl = ({
  time,
  video,
  media,
  sound,
  lectureId,
  srt,
  srt_en,
  srtArray,
  index,
  onChange,
  contextName,
  rowNumber,
  description,
  series,
  verseId,
  seriesId,
  verse
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const playerRef = React.useRef(null);
  const [show, setShow] = React.useState(false);
  const [text, setText] = React.useState(null);
  const setAudio = useSoundControlStore((state) => state.setAudio);
  const audioRef = React.useRef(null);
  const ccType = useCCTypeStore((state) => state.type);
  const setPosition = useCurrentPositionStore((state) => state.setPosition);
  const setShowPlayerAction = usePlayerActionStore((state) => state.setShow);
  const theme = useTheme();
  const { sync, setSync } = useSyncMediaSourceStore((state) => state);
  const [player, setPlayer] = React.useState(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // React.useEffect(() => {
  //   if (!!sync?.[lectureId] && media === "sound") {
  //     audioRef.current.currentTime = sync?.[lectureId];
  //   } else if (!!sync?.[lectureId] && media === "video") {
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
   
    if (!audioRef) return;

    if (!!time && media === "sound") {
      audioRef.current.currentTime = time;
    } else if (!!time && media === "video") {
      playerRef.current.seekTo(time);
    }
  }, [time]);
  

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setAudio(audio);
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));
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
    const internalPlayer = playerRef.current?.getInternalPlayer();
    if (internalPlayer?.requestPictureInPicture) {
      internalPlayer.requestPictureInPicture().catch((err) => {
        console.error("Picture-in-Picture error:", err);
      });
    } else {
      console.warn("PiP is not supported by this browser or video element.");
    }
  }, []);

  const disableSubtitles = () => {
    const videoEl = playerRef.current?.getInternalPlayer();
    if (videoEl?.textTracks) {
      Array.from(videoEl.textTracks).forEach((track) => {
        track.mode = "disabled";
      });
    }
  };
  
 
  const enableSubtitleByLang = (lang) => {
    const videoEl = playerRef.current?.getInternalPlayer();
    if (videoEl?.textTracks) {
      Array.from(videoEl.textTracks).forEach((track) => {
        track.mode = track.language === lang ? "showing" : "disabled";
      });
    }
  };

  React.useEffect(() => {
    const videoEl = playerRef.current?.getInternalPlayer();
    if (!videoEl || !videoEl.textTracks) return;
  
    if (ccType === "off") {
      disableSubtitles();
    } else if (ccType === "fa") {
      enableSubtitleByLang("fa");
    } else if (ccType === "en") {
      enableSubtitleByLang("en");
    }
  }, [ccType, player]);

  return (
    <>
      {media === "sound" && (
        <Box
          sx={{
            width: 1,
            minHeight: 200,
            position: "relative",
            bgcolor: "#24030b",
            overflow: "hidden",
            borderRadius: (theme) => theme.spacing(3),
            zIndex: 999,
          }}
        >
          {!show && (
            <CircularProgress
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                marginLeft: "-20px",
                marginTop: "-20px",
              }}
            />
          )}

          {/* <Equalizer
            backgroundColor="#24030b"
            audioUrl={sound?.url}
            playing={isPlaying}
            audioRef={audioRef}
          /> */}

          <Box
            sx={{
              position: "absolute",
              bottom: '50%',
              minHeight: 90,
              left: 0,
              width: "100%",
              pb: 4,
              color: "white",
              textAlign: "center",
              transform: "translateY(50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!!text && ccType !== "off" && (
              <Typography sx={{ px: 2 }}>{text}</Typography>
            )}
          </Box>
        </Box>
      )}

      {media === "sound" && (
        <Box
          sx={{
            mt: 1,
            bgcolor: "background.default",
            borderRadius: (theme) => theme.spacing(3, 3, 0, 0),
            pt: 0.4,
            width: 1,
            display: "flex",
            justifyContent: "center",
            audio: {
              width: "calc(100% - 20px)",
              background: "primary.main",
            },
          }}
        >
          <audio
            controls
            ref={audioRef}
            crossOrigin="anonymous"
            preload="metadata"
          >
            <source src={sound?.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}

      {!!show && media === "video" && (
        <Box sx={{ position: "relative" }}>
          <IconButton
            sx={{
              color: "white",
              position: "absolute",
              right: 25,
              top: 10,
              zIndex: 9999,
            }}
            onClick={handlePictureInPicture}
          >
            <Image
              alt="pictureInPicture"
              src={`/icons/${theme.palette.mode}/pictureInPictureLight.svg`}
              width={24}
              height={24}
            />
          </IconButton>

          <ReactPlayer
            ref={playerRef}
            onReady={onReady}
            config={{
              file: {
                attributes: { playsInline: true },
                tracks: srt
                  ? [
                      {
                        kind: "subtitles",
                        src: `/api/srt/vtt/${lectureId}?filename=${srt?.fileName}`,
                        srcLang: "fa",
                        default: true,
                      },
                      ...(srt_en?.fileName
                        ? [
                            {
                              kind: "subtitles",
                              src: `/api/srt/vtt/${lectureId}?filename=${srt_en.fileName}`,
                              srcLang: "en",
                            },
                          ]
                        : []),
                    ]
                  : [],
              },
            }}
            playing={isPlaying}
            onProgress={({ playedSeconds }) => {
              setPosition(playedSeconds);
              setSync({ ...sync, [lectureId]: playedSeconds });
            }}
            height="auto"
            width="100%"
            controls={true}
            url={video?.url}
          />
        </Box>
      )}

      <DesktopInfo
        {...{
          contextName,
          rowNumber,
          description,
          onChange,
          series,
          verseId,
          seriesId,
          verse
        }}
        media={media}
        index={index}
      />
    </>
  );
};
