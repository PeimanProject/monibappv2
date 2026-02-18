"use client";

import { appConfig, desktopValues } from "@/core/config/values";
import { Box, Typography } from "@mui/material";
import React from "react";
import ReactPlayer from "react-player";
import _ from "lodash";
import {
  useCCTypeStore,
  useCurrentPositionStore,
  useSoundControlStore,
  useVideoControlStore,
} from "@/store/player/usePlayerStore";
import { usePlayerActionStore } from "@/store/usePlayerActionStore";

// import Equalizer from "./equalizer";
import { useSyncMediaSourceStore } from "@/store/useSyncMediaSourceStore";
import { MobileInfo } from "./mobileInfo";
import { iosAudioSession } from "@/app/libs/iosAudioSession";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useTranslate } from "@/core/useTranslation";
import { useVttTrack } from "@/app/libs/srtHandler";
import { useConnectivity } from "@/core/ConnectivityProvider";
import { Capacitor } from '@capacitor/core';
import { usePlayerHistoryStore } from "@/store/playerHistoryStore";
export const MobilePlayerControl = ({
  media,
  srtArray,
  time,
  onChange,
  index,
  video,
  sound,
  lectureId,
  id,
  srt,
  srt_en,
  title,
  contextName,
  rowNumber,
  description,
  series,
  verseId,
  seriesId,
  verse,
}) => {
  console.log({ lectureId })
  // استفاده از علامت سوال قبل از نقطه برای جلوگیری از خطا در صورت null بودن
  const soundFinalSrc = sound?.localPath ? Capacitor.convertFileSrc(sound.localPath) : null;
  const videoFinalSrc = video?.localPath ? Capacitor.convertFileSrc(video.localPath) : null;

  const faVtt = useVttTrack({
    lectureId,
    filename: srt?.fileName,
  });
  const enVtt = useVttTrack({
    lectureId,
    filename: srt_en?.fileName,
  });
  const { isConnected } = useConnectivity()
  const { get } = useTranslate()
  const [isPlaying, setIsPlaying] = React.useState(false);
  const playerRef = React.useRef(null);
  const [show, setShow] = React.useState(false);
  const [text, setText] = React.useState(null);
  const setAudio = useSoundControlStore((state) => state.setAudio);
  const setVideo = useVideoControlStore((state) => state.setVideo);
  const audioRef = React.useRef(null);

  const ccType = useCCTypeStore((state) => state.type);
  const setPosition = useCurrentPositionStore((state) => state.setPosition);
  const setShowPlayerAction = usePlayerActionStore((state) => state.setShow);

  const { sync, setSync } = useSyncMediaSourceStore((state) => state);

  const savePosition = usePlayerHistoryStore((state) => state.savePosition);
  const getPosition = usePlayerHistoryStore((state) => state.getPosition);
  const lastTime = getPosition(lectureId || id);
  const lastSavedTimeRef = React.useRef(0);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!audioRef) return;

    if ((!!time || !!lastTime) && media === "sound") {
      audioRef.current.currentTime = time || lastTime;
    } else if ((!!time || !!lastTime) && media === "video") {
      playerRef.current.currentTime = time || lastTime;
    }
  }, []);

  const handleTimeUpdate = React.useCallback(() => {
    const currentTime = audioRef?.current?.currentTime;
    if (!currentTime) return;
    savePosition(lectureId || id, currentTime);
    setPosition(currentTime);
    setSync({ ...sync, [lectureId || id]: currentTime });
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

    // Set up iOS audio session for the audio element
    iosAudioSession.setupAudioElement(audio);

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
      if (!isReady) {
        setIsReady(true);
        playerRef.current.currentTime = lastTime;
      }
      setVideo(p);
    },
    [setVideo, playerRef.current, lastTime]
  );

  const handlePictureInPicture = React.useCallback(() => {
    setShowPlayerAction(
      false,
      { title, video: video?.url, sound: sound?.url, lectureId: lectureId || id },
      true
    );
    if (playerRef?.current) {
      playerRef.current.pause();
    }
  }, [setShowPlayerAction, playerRef, video, sound, lectureId || id, title]);


  const setMediaSession = () => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: `${contextName} / ${get("Lecture.lecture")} ${digitsEnToFa(rowNumber)}`,
        artist: `${appConfig.author}`,
        album: `${appConfig.name}`,
        artwork: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      });
    }
  };

  React.useEffect(() => {
    if (!isConnected) return;
    setMediaSession();
  }, [isConnected]);

  React.useEffect(() => {
    if (!playerRef?.current) return;

    const videoEl = playerRef.current;
    if (videoEl && videoEl.textTracks) {
      Array.from(videoEl.textTracks).forEach((track) => {
        if (ccType === "off") {
          track.mode = "disabled";
        } else {
          track.mode = track.language === ccType ? "showing" : "disabled";
        }
      });
    }
  }, [ccType]);

  console.log({ srt, srt_en })
  return (
    <>
      <Box
        sx={{
          width: 1 / 1,
          position: "relative",

          ...(!!text &&
            ccType !== "off" && {
            bgcolor: "black",
            minHeight: 200,
          }),
          ...(!text ||
            (ccType === "off" && {
              pt: 1,
            })),

          position: "sticky",
          overflow: "hidden",
          top: desktopValues({}).APP_HEIGHT,
          zIndex: 999,
        }}
      >
        <MobileInfo
          {...{
            contextName,
            rowNumber,
            description,
            onChange,
            series,
            verseId,
            seriesId,
            sound,
            video,
            handlePictureInPicture,
            verse,
          }}
          media={media}
          index={index}
        />
        {/* {media === "sound" && (
          <Equalizer
            audioUrl={sound?.url}
            playing={isPlaying}
            audioRef={audioRef}
          />
        )} */}

        {media === "sound" && !!text && ccType !== "off" && (
          <Box
            sx={{
              // position: "absolute",
              bottom: 30,
              minHeight: 145,
              left: 0,
              width: "calc(100% - 0px)",
              pb: 2,

              color: "white",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!!text && ccType !== "off" && (
              <Typography sx={{ px: 2 }}>{text}</Typography>
            )}
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

            }}
          >
            {/* <audio
              ref={audioRef2}
              src={sound?.url}
              muted
              preload="metadata"
              crossOrigin="anonymous"
              style={{ display: "none" }}
              onTimeUpdate={handleTimeUpdate}
            /> */}
            <audio
              controls
              ref={audioRef}
              preload="metadata"
              playsInline
              controlsList="nodownload"
              autoPlay
              muted
              webkit-playsinline="true"
              onPlay={() => {
                if (audioRef.current?.muted) {
                  audioRef.current.muted = false;
                }
              }}
              x-webkit-airplay="allow"
              crossOrigin="anonymous"
              style={{
                width: "calc(100% - 20px)",
              }}
            >
              <source src={sound?.url || soundFinalSrc} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </Box>
        )}

        {/* {!!audioRef?.current && <VoiceVisualizer  />} */}
        {!!show && media === "video" && (
          <video
            ref={(el) => {
              playerRef.current = el;
              if (el && !el.dataset.ready) {
                el.dataset.ready = "true";
                onReady(el);
              }
            }}
            playsInline
            controls
            controlsList="nodownload"
            style={{ width: "100%", height: "auto" }}
            onTimeUpdate={(e) => {
              const currentTime = e.target.currentTime;
              savePosition(lectureId || id, currentTime);
              setPosition(currentTime);
              setSync({ ...sync, [lectureId || id]: currentTime });
              if (!!srtArray?.[ccType]) {
                const text = srtArray[ccType].find(
                  (caption) =>
                    currentTime >= caption?.start && currentTime <= caption?.end
                );
                setText(text?.text);
              }
            }}
            crossOrigin="anonymous"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            src={video?.url || videoFinalSrc}
          >
            {srt && (
              <track
                kind="subtitles"
                src={`https://monibapp.ir/api/srt/vtt/${lectureId || id}?filename=${srt?.fileName}`}
                srcLang="fa"
                default
              />
            )}
            {srt_en?.fileName && (
              <track
                kind="subtitles"
                src={`https://monibapp.ir/api/srt/vtt/${lectureId || id}?filename=${srt_en.fileName}`}
                srcLang="en"
              />
            )}
            Your browser does not support the video element.
          </video>
        )}
      </Box>
    </>
  );
};
