"use client";

import React from "react";
import _ from "lodash";
import { Box, Button, Typography, useTheme } from "@mui/material";
import DownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/image";
import Link from "next/link";
import { ItemKey } from "@/app/component/seriesItemKey";
import { useTranslate } from "@/core/useTranslation";

export const LastLectureContentKey = ({ displayTitle, displayDate, verse }) => {
  const theme = useTheme();
  return (
    <>
      <Image
        src={`/icons/${theme.palette.mode}/play.svg`}
        width={24}
        height={24}
        alt="Play Icon"
      />
      <Typography
        variant="caption"
        sx={{ ml: 1, fontWeight: "bold", textAlign: "left" }}
      >
        {displayTitle}
      </Typography>
      {verse && (
        <Typography
          variant="caption"
          sx={{ ml: 1, color: "text.secondary", textAlign: "left" }}
        >
          {verse}
        </Typography>
      )}
      <Box sx={{ flex: 1 }} />
      <Typography variant="caption">{displayDate}</Typography>
    </>
  );
};

export const MobileHomeLastLecture = ({ list, titleStyle = "normal" }) => {
  const { get } = useTranslate()
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          px: 0,
          mt: 0.5,
          justifyContent: "center",
          alignItems: "center",
          ">a": {
            width: 1 / 1,
            color: "text.primary",
            textDecoration: "none",
          },
        }}
      >
        <Link href={`/last`}>
          <Box
            sx={{
              height: 40,
              ...(titleStyle === "normal" && {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "primary.dark"
                    : "primary.main",
                borderRadius: 2,
              }),
              ...(titleStyle === "live" && {
                borderBottom: 1,
                borderColor: "primary.main",
              }),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              width: 1 / 1,
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              {get("Items.lastLecture")}
            </Typography>
          </Box>
        </Link>
        {_.map(_.take(list?.list, 4), (item, index) => (
          <Link key={index} href={`/player?id=${item.id}`}>
            <ItemKey show={true}>
              <LastLectureContentKey {...item} />
            </ItemKey>
          </Link>
        ))}
        <Link href={`/last`}>
          <Button
            size="small"
            sx={{ color: "primary.dark", mt: 1 }}
            fullWidth
            endIcon={<DownIcon />}
          >
            {get("Items.more")}
          </Button>
        </Link>
      </Box>
    </>
  );
};
