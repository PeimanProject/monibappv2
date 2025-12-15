"use client";

import React from "react";
import {
  Dialog,
  alpha,
  DialogTitle,
  Typography,
  Box,
  IconButton,
  DialogContent,
} from "@mui/material";
import { usePlayerActionStore } from "@/store/usePlayerActionStore";
import { Close } from "@mui/icons-material";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import ReactPlayer from "react-player";
import { useSyncMediaSourceStore } from "@/store/useSyncMediaSourceStore";

export const PlayerAction = () => {
  const { show, setShow, data, pictureInPicture } = usePlayerActionStore(
    (state) => state
  );
  const theme = useTheme();
  const router = useRouter();
  const locale = useLocale();
  const playerRef = React.useRef(null);
  const [player, setPlayer] = React.useState(null);
  const { sync, setSync } = useSyncMediaSourceStore((state) => state);

  const onReady = React.useCallback(
    (p) => {
      setPlayer(p);
    },
    [setPlayer]
  );

  React.useEffect(() => {
    if (!!sync?.[data?.lectureId] && !!player) {
      playerRef?.current?.seekTo(sync?.[data?.lectureId]);
      playerRef?.current?.getInternalPlayer()?.play?.();
    }
  }, [data, player]);

  const handleBack = React.useCallback(() => {
    if (!!data?.lectureId) {
      setShow(false, data, false);
      router.push(`/${locale}/player/${data?.lectureId}/?media=video`);
    } else {
      setShow(true, data, false);
    }
  }, [setShow, data]);

  return (
    <>
      <Dialog
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
        maxWidth="sm"
        fullWidth
        open={show}
        onClose={() => setShow(false, null, false)}
      >
        <DialogTitle
          sx={{
            minHeight: 46,
            display: "flex",
            alignItems: "center",
          }}
          component="div"
        >
          <IconButton
            sx={{ ml: 1 }}
            onClick={() => setShow(false, null, false)}
          >
            <Close />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <IconButton sx={{ mr: 1 }} onClick={() => setShow(false, data, true)}>
            <Image
              alt="pictureInPicture"
              src={`/icons/${theme.palette.mode}/pictureInPicture.svg`}
              width={24}
              height={24}
            />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              p: 2,
              video: {
                width: 1 / 1,
                borderRadius: 3,
                boxShadow: 10,
              },
            }}
          >
            {data?.video && (
              <video playsInline controls>
                <source src={data.video} type="video/mp4" />
              </video>
            )}
            <Typography
              variant="body1"
              sx={{ px: 2, color: "white", mt: 1, textAlign: "center" }}
            >
              {data?.title}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
      {!!pictureInPicture && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            width: 1 / 1,
            bgcolor: "primary.dark",

            zIndex: (theme) => theme.zIndex.drawer,
            display: "flex",
            pb: 13,
          }}
        >
          <Box
            sx={{
              flexBasis: 180,
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              color: "white",
              position: "relative",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                sx={{ color: "white" }}
                onClick={() => setShow(false, null, false)}
              >
                <Close />
              </IconButton>
              <IconButton sx={{ color: "white" }} onClick={handleBack}>
                <FullscreenExitIcon />
              </IconButton>
            </Box>
            <Typography variant="body1" sx={{ px: 2, color: "white" }}>
              {data?.title}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                p: 1,
                video: {
                  width: 1 / 1,
                },
              }}
            >
              {data?.video && (
                <ReactPlayer
                  ref={playerRef}
                  onReady={onReady}
                  config={{
                    file: {
                      attributes: { playsInline: true },
                    },
                  }}
                  height="auto"
                  onProgress={(state) => {
                    const currentTime = state.playedSeconds;

                    if (!!data?.lectureId) {
                      setSync({ ...sync, [data?.lectureId]: currentTime * 1 });
                    }
                  }}
                  width={"100%"}
                  controls={true}
                  url={data.video}
                />

                // <video playsInline controls>
                //   <source src={data.video} type="video/mp4" />
                // </video>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
