"use client";

import { Box, Container, Typography, Divider } from "@mui/material";
import React, { useEffect } from "react";
import { MobileHomeLastLecture } from "@/app/fragment/homeLastLecture/mobileHomeLastLecture";
import _ from "lodash";
import { Timer } from "@/app/component/timer";
import Iframe from "react-iframe";
import Image from "next/image";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useNavBarStore } from "@/store/layout/useNavBarStore";
import { useTranslate } from "@/core/useTranslation";

const Live = ({ live, data, desktop }) => {
  const { get } = useTranslate()
  return (
    <>
      {live?.active && (
        <Box>
          <Iframe
            url={live?.active?.videoLink}
            width="100%"
            height={"auto"}
            styles={{ minHeight: desktop ? 350 : 200 }}
            id=""
            className=""
            display="block"
            position="relative"
          />
        </Box>
      )}
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.main",
          minHeight: 50,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {!!data && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }} variant="body1">
              {data?.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: 1 / 1,
                mt: 1,
              }}
            >
              <Typography variant="body2">{data?.displayDate}</Typography>
              <Typography sx={{ ml: 2, mr: 0.5 }}>{get("Live.time")}:</Typography>
              <Typography variant="body2">{data?.time}</Typography>
              <Box sx={{ flex: 1 }} />
              {!!live?.liveCounter && <Timer time={live?.liveCounter?.time} />}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

const NoLive = ({ data, live, desktop }) => {
  const { get } = useTranslate()
  return (
    <Container disableGutters>
      <Box
        sx={{
          height: desktop ? 350 : 250,
          ...(desktop && { py: 2 }),
          img: {
            objectFit: desktop ? "contain" : "cover",
            width: 1 / 1,
          },
        }}
      >
        <Image
          alt="Live"
          src="/poster.jpg"
          width={400}
          height={desktop ? 350 : 250}
        />
      </Box>
      {!!data && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              bgcolor: "primary.main",
            }}
          >
            {!!live?.liveCounter && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  width: 200,
                  bgcolor: "var(--live-color)",
                  py: 0.5,
                  px: 2,
                  m: 1,
                  color: "white",
                }}
              >
                <Typography sx={{ mr: 1 }} variant="body2">
                  {get("Live.toLive")}
                </Typography>
                <Timer time={live?.liveCounter?.time} pure />
              </Box>
            )}
          </Box>
          <Box
            sx={{
              p: 3,
              bgcolor: "primary.main",

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {!!live?.ai_live?.rowNumber && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",

                  width: 1 / 1,
                }}
              >
                <Typography sx={{ fontWeight: "bold" }} variant="body1">
                  {live?.ai_live?.seriesName}
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Typography sx={{ mr: 1 }} variant="body2">
                  {get("Live.lecture")}
                </Typography>
                <Typography sx={{ fontWeight: "bold" }} variant="body1">
                  {!!live?.ai_live?.rowNumber &&
                    digitsEnToFa(live?.ai_live?.rowNumber)}
                </Typography>
              </Box>
            )}
            <Divider sx={{ width: 1 / 1, my: 1, borderColor: "#94a29d" }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                width: 1 / 1,
              }}
            >
              <Typography variant="body2">{data?.displayDate}</Typography>
              <Box sx={{ flex: 1 }} />
              <Typography sx={{ ml: 2, mr: 0.5 }}>{get("Live.time")}:</Typography>
              <Typography variant="body2">{data?.time}</Typography>
            </Box>
            <Divider sx={{ width: 1 / 1, my: 1, borderColor: "#94a29d" }} />
            <Typography variant="body2">
              {live?.ai_live?.data?.location}
            </Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export const MobileLive = ({ live, lastLecture, desktop }) => {
  const [data, setData] = React.useState(null);
  const { setNavBar } = useNavBarStore();

  React.useEffect(() => {
    if (live?.list?.length > 0) {
      setData(live?.list[0]);
    } else {
      setData(live?.active);
    }
  }, [live]);

  useEffect(() => {
    setNavBar({
      title: "پخش زنده",
    });
  }, [setNavBar]);

  const content = (
    <>
      {!!live?.active && <Live desktop={desktop} live={live} data={data} />}
      {!!!live?.active && (
        <NoLive desktop={desktop} data={data} live={live} />
      )}
      <Container sx={{ pb: 20 }}>
        <MobileHomeLastLecture list={lastLecture} titleStyle="live" />
      </Container>
    </>
  );

  return (
    <>
      {desktop ? <Container maxWidth="md">{content}</Container> : content}
    </>
  );
};
