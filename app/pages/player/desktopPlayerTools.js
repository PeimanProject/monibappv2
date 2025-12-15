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
  useTheme,
  Grid,
  Container,
} from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { useAddToPlayListStore } from "@/store/usePlayListStore";
import { useUserStore } from "@/store/useUserStore";
import { useAuthLoginStore } from "@/store/layout/useProfileStore";
import {
  useCCTypeStore,
  useCurrentPositionStore,
} from "@/store/player/usePlayerStore";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { numberToWords } from "@persian-tools/persian-tools";
import { CustomStyledMenu } from "./mobilePlayerAI";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { CustomDrawer, DrawerToolbar } from "@/app/component/customDrawer";
import { TabCircleItem, TabStyle } from "@/app/component/tabStyle";
import _ from "lodash";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useCallback } from "react";

export const DesktopPlayerTools = ({
  lectureId,
  sound,
  video,
  download,
  os,
  srt,
  srt_en,
  srtArray,
  rowNumber,
  contextName,
}) => {
  const theme = useTheme();
  const t = useTranslations("Lecture");
  const [showDownload, setShowDownload] = React.useState(false);
  const setShowPlayList = useAddToPlayListStore((state) => state.setShow);
  const user = useUserStore((state) => state.user);
  const setShowLogin = useAuthLoginStore((state) => state.setShow);
  const anchorRef = React.useRef(null);
  const [showText, setShowText] = React.useState(false);
  const [value, setValue] = React.useState("fa");
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const currentPosition = useCurrentPositionStore((state) => state.current);

  const isCurrent = useCallback(
    (caption) => {
      return currentPosition >= caption?.start && currentPosition <= caption?.end;
    },
    [currentPosition]
  );

  const handleChange = React.useCallback(
    (value, index) => () => {
      setValue(value);
      setIndex(index);
    },
    []
  );

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

  const { type, setType } = useCCTypeStore((state) => state);
  const handleClose = React.useCallback((event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }, []);

  const handleToggle = React.useCallback(
    () => setOpen((prevOpen) => !prevOpen),
    []
  );

  const handleShowText = React.useCallback(
    (show) => () => setShowText(show),
    []
  );

  const handleChangeCCType = React.useCallback(
    (event) => {
      setType(event.target.value);
      setOpen(false);
    },
    [setType]
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
              {t("audioDownload")}
            </Button>

            <Box sx={{ flexBasis: 10 }} />

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleDownloadFile(download.video)}
            >
              {t("videoDownload")}
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
      <Grid
        container
        spacing={1}
        sx={{
          // display: "flex",
          // alignItems: "center",
          mt: 2,

          ">a": {
            mx: 0.2,
            // flex: 1,
          },
        }}
      >
        <Grid size={4}>
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
            {t("download")}
          </Button>
        </Grid>
        <Grid size={4}>
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
            {t("share")}
          </Button>
        </Grid>
        <Grid size={4}>
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
            {t("playlist")}
          </Button>
        </Grid>

        {!!srt?.fileName && (
          <>
            <Grid size={6}>
              <Button
                size="small"
                color="primary"
                variant="contained"
                disableElevation
                sx={{ mx: 0.2 }}
                fullWidth
                onClick={handleToggle}
                ref={anchorRef}
                endIcon={
                  <Image
                    alt="cc"
                    src={`/icons/${theme.palette.mode}/cc.svg`}
                    width={24}
                    height={24}
                  />
                }
              >
                {t("cc")}
              </Button>
            </Grid>
            <CustomStyledMenu
              horizontalOrigin="right"
              onClose={handleClose}
              open={open}
              anchorEl={anchorRef.current}
            >
              <RadioGroup value={type} onChange={handleChangeCCType}>
                <FormControlLabel
                  value="fa"
                  control={<Radio color="default" />}
                  label={t("cc_fa")}
                />
                {srt_en?.fileName && (
                  <FormControlLabel
                    value="en"
                    control={<Radio color="default" />}
                    label={t("cc_en")}
                  />
                )}
                <FormControlLabel
                  value="off"
                  control={<Radio color="default" />}
                  label={t("cc_off")}
                />
              </RadioGroup>
            </CustomStyledMenu>

            <Grid size={6}>
              <Button
                size="small"
                color="primary"
                variant="contained"
                disableElevation
                sx={{ mx: 0.2 }}
                fullWidth
                onClick={handleShowText(true)}
                endIcon={
                  <Image
                    alt="transcript"
                    src={`/icons/${theme.palette.mode}/transcript.svg`}
                    width={24}
                    height={24}
                  />
                }
              >
                {t("transcript")}
              </Button>
            </Grid>
            <CustomDrawer
              anchor={"bottom"}
              open={showText}
              hideBackdrop={false}
              onClose={handleShowText(false)}
            >
              <DrawerToolbar onClose={handleShowText(false)}>
                {!!rowNumber && (
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", fontSize: 14 }}
                      >
                        {contextName}
                      </Typography>
                    </Box>
                    <Typography>
                      {t("lecture")}{" "}
                      {numberToWords(rowNumber, { ordinal: true })}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ flex: 1 }} />
                {!!srtArray?.["en"] && (
                  <TabStyle style="circle" index={index}>
                    <TabCircleItem
                      onChange={handleChange}
                      value={"fa"}
                      index={0}
                      selected={value === "fa"}
                    >
                      <Typography>{t("cc_s_fa")}</Typography>
                    </TabCircleItem>
                    <TabCircleItem
                      onChange={handleChange}
                      value={"en"}
                      index={1}
                      selected={value === "en"}
                    >
                      <Typography>{t("cc_s_en")}</Typography>
                    </TabCircleItem>
                  </TabStyle>
                )}
                <CopyToClipboard
                  text={_.join(_.map(srtArray?.[value], "text"), " ")}
                >
                  <IconButton>
                    <ContentCopyIcon />
                  </IconButton>
                </CopyToClipboard>
              </DrawerToolbar>
              <Box
                sx={{
                  maxHeight: "calc(100vh - 200px)",
                  position: "relative",
                }}
              >
                <Container>
                  <Typography
                    component="div"
                    sx={{
                      textAlign: "justify",
                      pt: 2,
                      px: 3,
                      pb: 22,
                      lineHeight: 1.8,
                    }}
                  >
                    {srtArray[value].map((item, index) => (
                      <Box
                       
                        sx={{
                          ...(isCurrent(item) && {
                            color: "red",
                          }),
                          mx:0.5
                        }}
                        key={index}
                      >
                        {item.text}
                      </Box>
                    ))}
                  </Typography>
                </Container>
              </Box>
            </CustomDrawer>
          </>
        )}
      </Grid>
    </>
  );
};
