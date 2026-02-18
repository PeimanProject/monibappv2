"use client";

import * as React from "react";
import {
  Box,
  ButtonBase,
  IconButton,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import _ from "lodash";
import Link from "next/link";
import Image from "next/image";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useTranslate } from "@/core/useTranslation";

export const DesktopLectureList = ({
  lectureList,
  title,
  description,
  desktop,
  lectureCount,
  lastCourseId,
  newCourseId,
  mainId,
  os
}) => {
  const theme = useTheme();
  const { get } = useTranslate()
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mt: 3,
        width: 1 / 1,
      }}
    >
      {desktop && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{ color: "text.primary", fontWeight: "bold" }}
              >
                {title}
              </Typography>

              <Typography sx={{ ml: 1 }}>
                {digitsEnToFa(`${lectureCount}`)} {get("Lecture.lecture")}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {description}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          {mainId === 1 && (lastCourseId || newCourseId) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                mt: 1,
                px: 1,
              }}
            >
              <Link href={`/series?seriesId=${lastCourseId || newCourseId}`}>
                <Button variant="contained" color="primary" size="small">
                  {lastCourseId ? "دور پیشین" : "دور جدید"}
                </Button>
              </Link>
            </Box>
          )}
        </Box>
      )}
      {_.map(lectureList, (item, index) => (
        <Box
          sx={{
            ">a:first-of-type": { textDecoration: "none", flex: 1 },
            borderBottom: 1,
            display: "flex",
            alignItems: "center",

            borderColor: (theme) =>
              theme.palette.mode === "dark" ? "primary.dark" : "primary.main",
          }}
          key={index}
        >
          <Link href={`/player?id=${item.id}`}>
            <ButtonBase
              component="div"
              sx={{
                minHeight: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                px: 1,
              }}
            >
              <Image
                width={30}
                height={30}
                alt="Play icon"
                src={`/icons/${theme.palette.mode}/play.svg`}
              />
              <Box
                sx={{
                  mx: 2,
                  flex: 1,
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {item?.lectureName && (
                  <Typography sx={{ color: "text.primary" }} variant="caption">
                    {item.title}
                  </Typography>
                )}
                <Typography
                  sx={{
                    fontWeight: "bold",
                    display: "inline-block",
                    color: "text.primary",
                  }}
                >
                  {item?.lectureName || item.title || `جلسه ${index + 1}`}
                </Typography>

                <Typography
                  sx={{
                    whiteSpace: "nowrap",
                    fontSize: 11,
                    color: "text.primary",
                  }}
                  component={"span"}
                  variant="subtitle2"
                >
                  {item.verse}
                </Typography>
              </Box>

              <Typography
                sx={{ display: "block", mx: 2, color: "primary.dark" }}
                variant="caption"
              >
                {item.duration}
              </Typography>
            </ButtonBase>
          </Link>
          {/* {item?.files?.sound?.url && (
            <IconButton onClick={handleDownloadFile(item?.files?.sound?.url)}>
              <Box
                sx={{ maxWidth: 20 }}
                component={"img"}
                src={`/icons/${theme.palette.mode}/download.svg`}
              />
            </IconButton>
          )} */}
        </Box>
      ))}
    </Box>
  );
};
