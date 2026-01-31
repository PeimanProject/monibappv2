"use client";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  DialogTitle,
  IconButton,
  alpha,
  LinearProgress,
} from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { useAddToPlayListStore } from "@/store/usePlayListStore";
import { useUserStore } from "@/store/useUserStore";
import { useAuthLoginStore } from "@/store/layout/useProfileStore";
import { useTranslate } from "@/core/useTranslation";
import { Share } from "@capacitor/share";
import { downloadMedia, downloadMediaHandler } from "@/core/downloadHandler";
import { saveMediaIndb } from "@/core/dbHandler";

export const MobilePlayerTools = ({
  title,
  lectureId,
  sound,
  video,
  download,
  os,
  vertical
}) => {
  const { get } = useTranslate()
  const [showDownload, setShowDownload] = React.useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0); // Track progress
  const [isDownloading, setIsDownloading] = useState(false);   // Track state
  const [showSownloadOption, setShowDownloadOption] = useState({
    audio: false,
    video: false
  })
  const setShowPlayList = useAddToPlayListStore((state) => state.setShow);
  const user = useUserStore((state) => state.user);
  const setShowLogin = useAuthLoginStore((state) => state.setShow);

  const handleDownload = React.useCallback(
    (show) => () => {
      setShowDownload(show)
      setShowDownloadOption({ audio: false, video: false });
    },
    []
  );

  const handleShare = React.useCallback(async () => {
    await Share.share({
      text: window.location.href,
    });

  }, []);

  const handlePlayList = React.useCallback(() => {
    if (!!!user) {
      setShowLogin(true);
      return;
    }
    setShowPlayList(true, { lectureId, lecture: true });
  }, [setShowPlayList, user, setShowLogin]);

  const handleDownloadFileOffline = async () => {
    const isAudio = showSownloadOption.audio;
    const type = isAudio ? "sound" : "video";

    // مقادیر را از آبجکت JSON جلسه که در پراپس دارید بگیرید
    const downloadUrl = isAudio ? download.sound : download.video;
    const size = isAudio ? sound.display : video.display;

    try {
      setIsDownloading(true);
      setDownloadProgress(0);

      await downloadMediaHandler({
        lectureId: lectureId,
        type: type,
        url: downloadUrl,
        displaySize: size,
        onProgress: (percent) => setDownloadProgress(percent)
      });
    } catch (error) {
      console.error("Download Error:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <>
      <Dialog
        open={showDownload}
        maxWidth="sm"
        fullWidth
        onClose={handleDownload(false)}
        sx={{
          "& .MuiPaper-root": {
            bgcolor: (theme) => alpha(theme.palette.primary.dark, 0.8),
          },
        }}
        slotProps={{
          backdrop: {
            style: {
              background: "transparent",
            },
          },
        }}
      >
        <DialogTitle component="div">
          <IconButton onClick={handleDownload(false)}
            sx={{ ml: 2 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              px: 2,
              pt: 2,
              display: "flex",
              a: {
                flex: 1,
              },
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => setShowDownloadOption({ audio: true, video: false })}
            >
              {get("Lecture.audioDownload")}
            </Button>

            <Box sx={{ flexBasis: 10 }} />

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => setShowDownloadOption({ audio: false, video: true })}
            >
              {get("Lecture.videoDownload")}
            </Button>
          </Box>
          <Box sx={{ mt: 1, px: 2, pb: 4, display: "flex" }}>
            <Typography sx={{ flex: 1, textAlign: "center", direction: "rtl" }}>
              {sound?.display}
            </Typography>
            <Box sx={{ flexBasis: 10 }} />
            <Typography sx={{ flex: 1, textAlign: "center", direction: "rtl" }}>
              {video?.display}
            </Typography>
          </Box>
          {isDownloading && (
            <Box sx={{ width: '100%', mt: 2, px: 2 }}>
              <Typography variant="caption" color="white">
                {downloadProgress}%  در حال دانلود:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={downloadProgress}
                color="secondary"
                sx={{ height: 10, borderRadius: 5, mt: 1 }}
              />
            </Box>
          )}
          {(showSownloadOption.audio || showSownloadOption.video) && <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 1,
            mb: 2
          }}>
            <Button
              onClick={() => handleDownloadFileOffline(showSownloadOption.audio ? download.sound : download.video)}
              variant="contained" sx={{ width: 150 }}>
              {get("Lecture.saveOffline")}
            </Button>
            <Button variant="contained" sx={{ width: 150 }}>
              {get("Lecture.saveDevice")}
            </Button>
          </Box>}
        </DialogContent>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          ...(!!vertical && {
            flexDirection: "column",
            '>button': {
              mt: 1
            }

          }),
          mt: 2,
          maxWidth: 420,
          ">a": {
            mx: 0.2,
            flex: 1,
          },
        }}
      >
        <Button
          color="primary"
          variant="contained"
          disableElevation
          fullWidth
          sx={{ mx: 0.2 }}
          onClick={handleDownload(true)}
          size="small"
          endIcon={
            <Image
              alt="Download"
              src={`/icons/light/download.svg`}
              width={24}
              height={24}
            />
          }
        >
          {get("Lecture.download")}
        </Button>

        <Button
          size="small"
          color="primary"
          variant="contained"
          disableElevation
          sx={{ mx: 0.2 }}
          fullWidth
          onClick={handleShare}
          endIcon={
            <Image
              alt="Share"
              src={`/icons/light/share.svg`}
              width={24}
              height={24}
            />
          }
        >
          {get("Lecture.share")}
        </Button>
        <Button
          size="small"
          color="primary"
          variant="contained"
          disableElevation
          fullWidth
          onClick={handlePlayList}
          sx={{ mx: 0.2 }}
          endIcon={
            <Image
              alt="Playlist"
              src={`/icons/light/playlist.svg`}
              width={24}
              height={24}
            />
          }
        >
          {get("Lecture.playlist")}
        </Button>
      </Box>
    </>
  );
};
