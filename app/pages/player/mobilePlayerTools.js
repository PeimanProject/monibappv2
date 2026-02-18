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
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { useAddToPlayListStore } from "@/store/usePlayListStore";
import { useUserStore } from "@/store/useUserStore";
import { useAuthLoginStore } from "@/store/layout/useProfileStore";
import { useTranslate } from "@/core/useTranslation";
import { Share } from "@capacitor/share";
import { downloadMediaHandler } from "@/core/downloadHandler";
import { useConnectivity } from "@/core/ConnectivityProvider";
import { motion, AnimatePresence } from "framer-motion";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useNotify } from "@/core/notifire";
export const MobilePlayerTools = ({
  title,
  lectureId,
  mainId,
  sound,
  video,
  download,
  os,
  vertical
}) => {
  const notify = useNotify()
  const { isConnected } = useConnectivity()
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
        mainId: mainId,
        type: type,
        title: title,
        url: downloadUrl,
        displaySize: size,
        onProgress: (percent) => setDownloadProgress(percent)
      });
      notify("دانلود با موفقیت انجام شد", "success")
    } catch (error) {
      notify("خطا در دانلود", "error")
    } finally {
      setIsDownloading(false);
      setShowDownload(false)
      setShowDownloadOption({ audio: false, video: false });
    }
  };
  return (
    <>
      <Dialog
        open={showDownload}
        maxWidth="md"
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

        <DialogContent sx={{ m: 4 }}>
          <AnimatePresence mode="wait">
            {!isDownloading ? (
              <motion.div
                key="options"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  {/* کارت انتخاب صوت */}
                  <Box
                    onClick={() => setShowDownloadOption({ audio: true, video: false })}
                    sx={{
                      flex: 1, p: 2, borderRadius: 3, cursor: "pointer",
                      textAlign: "center", transition: "0.3s",
                      bgcolor: showSownloadOption.audio ? "secondary.main" : "rgba(255,255,255,0.05)",
                      border: "1px solid",
                      borderColor: showSownloadOption.audio ? "secondary.main" : "rgba(255,255,255,0.1)",
                      "&:hover": { bgcolor: showSownloadOption.audio ? "secondary.dark" : "rgba(255,255,255,0.1)" }
                    }}
                  >
                    <Typography variant="body2" color="white" fontWeight="bold">
                      {get("Lecture.audioDownload")}
                    </Typography>
                    <Typography variant="caption" color="rgba(255,255,255,0.7)" display="block">
                      {sound?.display}
                    </Typography>
                  </Box>

                  {/* کارت انتخاب ویدیو */}
                  <Box
                    onClick={() => setShowDownloadOption({ audio: false, video: true })}
                    sx={{
                      flex: 1, p: 2, borderRadius: 3, cursor: "pointer",
                      textAlign: "center", transition: "0.3s",
                      bgcolor: showSownloadOption.video ? "secondary.main" : "rgba(255,255,255,0.05)",
                      border: "1px solid",
                      borderColor: showSownloadOption.video ? "secondary.main" : "rgba(255,255,255,0.1)",
                      "&:hover": { bgcolor: showSownloadOption.video ? "secondary.dark" : "rgba(255,255,255,0.1)" }
                    }}
                  >
                    <Typography variant="body2" color="white" fontWeight="bold">
                      {get("Lecture.videoDownload")}
                    </Typography>
                    <Typography variant="caption" color="rgba(255,255,255,0.7)" display="block">
                      {video?.display}
                    </Typography>
                  </Box>
                </Stack>

                {/* دکمه‌های عملیاتی نهایی */}
                {(showSownloadOption.audio || showSownloadOption.video) && (
                  <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <Stack spacing={1.5} alignItems="center">
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<CloudDownloadIcon />}
                        onClick={() => handleDownloadFileOffline(showSownloadOption.audio ? download.sound : download.video)}
                        sx={{ borderRadius: 2, py: 1.2, fontWeight: "bold", bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "#f0f0f0" } }}
                      >
                        {get("Lecture.saveOffline")}
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{ borderRadius: 2, color: "white", borderColor: "rgba(255,255,255,0.3)" }}
                      >
                        {get("Lecture.saveDevice")}
                      </Button>
                    </Stack>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* بخش در حال دانلود */
              <motion.div
                key="progress"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center", padding: "20px 0" }}
              >
                <Typography variant="h6" color="white" sx={{ mb: 2 }}>
                  در حال دانلود ({downloadProgress}%)
                </Typography>
                <Box sx={{ width: '100%', position: 'relative' }}>
                  <LinearProgress
                    variant="determinate"
                    value={downloadProgress}
                    color="secondary"
                    sx={{
                      height: 12, borderRadius: 6, bgcolor: "rgba(255,255,255,0.1)",
                      "& .MuiLinearProgress-bar": { borderRadius: 6 }
                    }}
                  />
                </Box>
                <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ mt: 2, display: "block" }}>
                  لطفاً تا پایان عملیات شکیبا باشید...
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
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
          disabled={!isConnected}
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
          disabled={!isConnected}
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
