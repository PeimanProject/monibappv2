"use client";

import {
  Box,
  Divider,
  Typography,
  Button,
  useTheme,
  IconButton,
} from "@mui/material";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import React from "react";
import Image from "next/image";
import { TabCircleItem, TabStyle } from "@/app/component/tabStyle";
import Link from "next/link";
import { useCurrentVerseStore } from "@/store/useQuranStore";
import Menu from "@mui/material/Menu";
import { MobilePlayerTools } from "./mobilePlayerTools";
import { useTranslate } from "@/core/useTranslation";

export const VerseMobileInfo = ({
  contextName,
  rowNumber,
  description,
  index,
  onChange,
  series,
  verseId,
  media,
  handlePictureInPicture,
  seriesId,
  verse,
}) => {
  const { get } = useTranslate()
  const theme = useTheme();
  const verseP = useCurrentVerseStore((state) => state.verse);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        bgcolor: "text.primary",
        // position: "sticky",
        bgcolor: "background.default",
        // top: desktopValues({}).APP_HEIGHT + 240,
        // zIndex: 9999,
        pb: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",

          px: 2,
          pt: 2,
        }}
      >
        {!!rowNumber && (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                a: {
                  color: "text.primary",
                },
              }}
            >
              <Link href={`/series/${seriesId}`}>
                <Button color="inherit" sx={{ minWidth: 50, px: 0 }}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", fontSize: 14 }}
                  >
                    {contextName}
                  </Typography>
                </Button>
              </Link>
              <Divider
                orientation="vertical"
                sx={{ minHeight: 15, mx: 1, transform: "rotate(20deg)" }}
              />
              <Typography>
                {get("Lecture.lecture")} {digitsEnToFa(rowNumber)}
              </Typography>
            </Box>
            <Typography sx={{ mt: 1 }}>{description}</Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            mt: 1,
          }}
        >
          <Typography sx={{ mr: 1 }}>{get("Lecture.page")}</Typography>
          <Box
            sx={{
              bgcolor: "primary.main",
              borderRadius: 1,
              px: 1,
              py: 0.2,
            }}
          >
            {digitsEnToFa(verseP?.pageNo || "-")}
          </Box>
        </Box>

        <Box sx={{ flex: 1 }} />
        {media === "video" && (
          <IconButton onClick={handlePictureInPicture}>
            <Image
              alt="pictureInPicture"
              src={`/icons/${theme.palette.mode}/pictureInPicture.svg`}
              width={24}
              height={24}
            />
          </IconButton>
        )}
        <IconButton onClick={handleClick}>
          <Image
            alt="Sound"
            src={`/icons/${theme.palette.mode}/setting.svg`}
            width={32}
            height={32}
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box sx={{ p: 1, minWidth: 200 }}>
            <MobilePlayerTools {...verse} vertical />
          </Box>
        </Menu>
        <TabStyle style="circle" index={index}>
          <TabCircleItem onChange={onChange} value={"sound"} index={0}>
            <Image
              alt="Sound"
              src={`/icons/${theme.palette.mode}/sound.svg`}
              width={20}
              height={20}
            />
            <Typography sx={{ fontSize: 8 }} variant="caption">
              {get("Lecture.audio")}
            </Typography>
          </TabCircleItem>

          <TabCircleItem onChange={onChange} value={"video"} index={1}>
            <Image
              alt="Video"
              src={`/icons/${theme.palette.mode}/video.svg`}
              width={20}
              height={20}
            />
            <Typography sx={{ fontSize: 8 }} variant="caption">
              {get("Lecture.video")}
            </Typography>
          </TabCircleItem>
        </TabStyle>
      </Box>
    </Box>
  );
};
