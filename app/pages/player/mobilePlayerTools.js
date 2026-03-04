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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
export const MobilePlayerTools = ({
  title,
  id,
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
  const [downloadStatus, setDownloadStatus] = useState("idle"); // idle | success | error
  const [showSownloadOption, setShowDownloadOption] = useState({
    audio: false,
    video: false
  })
  const setShowPlayList = useAddToPlayListStore((state) => state.setShow);
  const user = useUserStore((state) => state.user);
  const setShowLogin = useAuthLoginStore((state) => state.setShow);
  const [lastDownloadType, setLastDownloadType] = useState(""); // "offline" | "public"
  const handleDownload = React.useCallback(
    (show) => () => {
      if (isDownloading) {
        notify("لطفا صبر کنید تا عملیات دانلود تمام شود", "error")
        return;
      }
      setShowDownload(show);
      // ریست کردن وضعیت‌ها هنگام باز و بسته شدن
      if (show === true) {
        setDownloadStatus("idle");
        setIsDownloading(false);
        setDownloadProgress(0);
      }
      setShowDownloadOption({ audio: false, video: false });
    },
    []
  );
  const handleShare = React.useCallback(async () => {
    await Share.share({
      text: `https://monibapp.ir/fa/player/${lectureId || id}`
    });

  }, []);

  const handlePlayList = React.useCallback(() => {
    if (!!!user) {
      setShowLogin(true);
      return;
    }
    setShowPlayList(true, { lectureId, lecture: true });
  }, [setShowPlayList, user, setShowLogin]);

  const handleDownloadFileOffline = async (toPublic = false) => {
    setLastDownloadType(toPublic ? "public" : "offline"); // ذخیره نوع انتخاب
    const isAudio = showSownloadOption.audio;
    const type = isAudio ? "sound" : "video";

    // مقادیر را از آبجکت JSON جلسه که در پراپس دارید بگیرید
    const downloadUrl = isAudio ? download.sound : download.video;
    const size = isAudio ? sound.display : video.display;

    try {
      setIsDownloading(true);
      setDownloadStatus("idle");
      setDownloadProgress(0);

      await downloadMediaHandler({
        lectureId: lectureId,
        mainId: mainId,
        type: type,
        title: title,
        url: downloadUrl,
        displaySize: size,
        saveToPublic: toPublic,
        onProgress: (percent) => setDownloadProgress(percent)
      });
      setDownloadStatus("success");
      // بستن خودکار دیالوگ بعد از ۲ ثانیه
      setTimeout(() => setShowDownload(false), 3000);
    } catch (error) {
      setDownloadStatus("error");
      // در صورت خطا، اجازه می‌دهیم کاربر پیام را ببیند و خودش ببندد یا دیالوگ بعد از ۳ ثانیه بسته شود
      setTimeout(() => setShowDownload(false), 3000);
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <>
      <Dialog
        open={showDownload}
        maxWidth="xs"
        fullWidth
        onClose={handleDownload(false)}
        sx={{
          "& .MuiPaper-root": {
            bgcolor: (theme) => alpha(theme.palette.primary.dark, 0.95),
            backgroundImage: "none",
            borderRadius: 5,
            // m: 2
          },
        }}
        slotProps={{
          backdrop: { style: { background: "rgba(0,0,0,0.5)" } },
        }}
      >
        <DialogTitle component="div">
          <IconButton onClick={handleDownload(false)}
            sx={{ ml: 2 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{
          m: 2,
          minHeight: '250px', // تضمین پایداری ارتفاع
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <AnimatePresence mode="wait">
            {!isDownloading && downloadStatus === "idle" && (
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
                        onClick={() => handleDownloadFileOffline(false)}
                        sx={{ borderRadius: 2, py: 1.2, fontWeight: "bold", bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "#f0f0f0" } }}
                      >
                        {get("Lecture.saveOffline")}
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleDownloadFileOffline(true)}
                        sx={{ borderRadius: 2, color: "white", borderColor: "rgba(255,255,255,0.3)" }}
                      >
                        {get("Lecture.saveDevice")}
                      </Button>
                    </Stack>
                  </motion.div>
                )}
              </motion.div>
            )}
            {isDownloading && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center", padding: "20px 0" }}
              >
                {/* تغییر داینامیک متن بر اساس پیشرفت */}
                <Typography variant="h6" color="white" sx={{ mb: 2 }}>
                  {downloadProgress > 100
                    ? "در حال ذخیره‌سازی در دستگاه..."
                    : `در حال دانلود (${downloadProgress}%)`}
                </Typography>

                <Box sx={{ width: '100%', position: 'relative' }}>
                  <LinearProgress
                    variant={downloadProgress > 100 ? "indeterminate" : "determinate"}
                    value={downloadProgress > 100 ? 0 : downloadProgress}
                    color="secondary"
                    sx={{
                      height: 12, borderRadius: 6, bgcolor: "rgba(255,255,255,0.1)",
                      "& .MuiLinearProgress-bar": { borderRadius: 6 }
                    }}
                  />
                </Box>

                <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ mt: 2, display: "block" }}>
                  {downloadProgress > 100
                    ? "لطفاً چند لحظه صبر کنید، فایل در حال انتقال به حافظه است"
                    : "لطفاً تا پایان عملیات شکیبا باشید..."}
                </Typography>
              </motion.div>
            )}
            {/* حالت ۳: موفقیت */}
            {downloadStatus === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: "center" }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 60, color: "#4caf50", mb: 2 }} />
                <Typography variant="h6" color="white">
                  دانلود با موفقیت انجام شد
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  {lastDownloadType === "offline"
                    ? "فایل در بخش «دانلودها» داخل اپلیکیشن ذخیره شد."
                    : "فایل در پوشه Documents حافظه گوشی ذخیره شد."}
                </Typography>
              </motion.div>
            )}

            {/* حالت ۴: خطا */}
            {downloadStatus === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: "center" }}
              >
                <ErrorOutlineIcon sx={{ fontSize: 60, color: "#f44336", mb: 2 }} />
                <Typography variant="h6" color="white">
                  خطا در عملیات دانلود
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  لطفاً اتصال اینترنت خود را بررسی کنید
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
