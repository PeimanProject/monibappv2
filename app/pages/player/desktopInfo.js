"use client";

import { Box, Divider, Typography, Button, useTheme } from "@mui/material";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import React from "react";
import Image from "next/image";
import { TabCircleItem, TabStyle } from "@/app/component/tabStyle";
import Link from "next/link";
import { useTranslate } from "@/core/useTranslation";

export const DesktopInfo = ({
  contextName,
  rowNumber,
  description,
  index,
  onChange,
  series,
  verseId,
  seriesId,
  verse
}) => {
  const theme = useTheme();
  const { get } = useTranslate()
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
        {!!series?.title && (
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
              <Button color="inherit" sx={{ minWidth: 20 }}>
                {series.title}
                {/* <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: 14 }}
                >
                  {series.title}
                </Typography> */}
              </Button>
            </Link>
            <Divider
              orientation="vertical"
              sx={{ minHeight: 15, mx: 2, transform: "rotate(20deg)" }}
            />
            <Typography>
              {get("Lecture.verse")} {digitsEnToFa(verseId)}
            </Typography>
          </Box>
        )}
        {!!rowNumber && (
          <Box>
            <Box
              sx={{
                mx: 1,
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
              {verse && (
                <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
                  {verse}
                </Typography>
              )}
            </Box>

            <Typography sx={{ px: 3 }}>{description}</Typography>
          </Box>
        )}
        <Box sx={{ flex: 1 }} />
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
