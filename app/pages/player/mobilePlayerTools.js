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
} from "@mui/material";
import React from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { useAddToPlayListStore } from "@/store/usePlayListStore";
import { useUserStore } from "@/store/useUserStore";
import { useAuthLoginStore } from "@/store/layout/useProfileStore";
import { useTranslate } from "@/core/useTranslation";

export const MobilePlayerTools = ({
  lectureId,
  sound,
  video,
  download,
  os,
  vertical
}) => {
  const { get } = useTranslate()
  const [showDownload, setShowDownload] = React.useState(false);
  const setShowPlayList = useAddToPlayListStore((state) => state.setShow);
  const user = useUserStore((state) => state.user);
  const setShowLogin = useAuthLoginStore((state) => state.setShow);

  const handleDownload = React.useCallback(
    (show) => () => setShowDownload(show),
    []
  );

  const handleShare = React.useCallback(async () => {
    await navigator.share({
      text: ``,
      url: window.location.href,
    });
  }, []);

  const handlePlayList = React.useCallback(() => {
    if (!!!user) {
      setShowLogin(true);
      return;
    }
    setShowPlayList(true, { lectureId, lecture: true });
  }, [setShowPlayList, user, setShowLogin]);

  const handleDownloadFile = React.useCallback(
    (url) => () => {
      const link = document.createElement("a");
      link.href = os === "iOS" ? "x-safari-" + url : url;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    []
  );

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
          <IconButton onClick={handleDownload(false)} sx={{ ml: 2 }}>
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
              onClick={handleDownloadFile(download.sound)}
            >
              {get("Lecture.audioDownload")}
            </Button>

            <Box sx={{ flexBasis: 10 }} />

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleDownloadFile(download.video)}
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
