"use client";

import {
  Box,
  ButtonBase,
  Container,
  IconButton,
  Typography,
  Grid,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import _ from "lodash";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { setDate } from "date-fns-jalali";
import { usePlayerActionStore } from "@/store/usePlayerActionStore";
import { getShareURL } from "@/core/config/api";
import { useNavBarStore } from "@/store/layout/useNavBarStore";
import { WisdomReq } from "@/app/data/wisdom/route";
import { Share } from "@capacitor/share";

const Section = ({ title, image, stringDuration, stringSize, file, id }) => {
  const theme = useTheme();
  const setShow = usePlayerActionStore((state) => state.setShow);

  const handleShare = React.useCallback(async (e) => {
    e.stopPropagation();
    await Share.share({
      text: `${getShareURL()}/wisdom?id=${id}/`,
    });

  }, []);

  return (
    <ButtonBase
      component="div"
      onClick={() =>
        setShow(true, {
          video: file,
          wisdom: true,
          title,
          stringDuration,
          stringSize,
        })
      }
      sx={{ my: 1, display: "flex", width: 1 / 1 }}
    >
      <Box
        sx={{
          flexBasis: 100,
          img: {
            objectFit: "cover",
            borderRadius: 3,
            border: 3,
            borderColor: "grey.400",
          },
        }}
      >
        <Image src={image} alt={title} width={100} height={100} />
      </Box>
      <Box
        sx={{
          flex: 1,
          px: 2,
          alignItems: "flex-start",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{ fontWeight: "medium", textAlign: "left" }}
          variant="caption"
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 0.5,
            color: "text.secondary",
          }}
        >
          <Typography variant="caption">{stringDuration}</Typography>
          <Typography sx={{ mx: 2 }} variant="caption">
            {stringSize}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 0 }}>
          <IconButton onClick={handleShare}>
            <Box
              component={"img"}
              sx={{ width: 18 }}
              src={`/icons/${theme.palette.mode}/share.svg`}
            />
          </IconButton>
          <IconButton>
            <Box
              component={"img"}
              sx={{ width: 18 }}
              src={`/icons/${theme.palette.mode}/playlist.svg`}
            />
          </IconButton>
          <IconButton>
            <Box
              component={"img"}
              sx={{ width: 18 }}
              src={`/icons/${theme.palette.mode}/download.svg`}
            />
          </IconButton>
        </Box>
      </Box>
    </ButtonBase>
  );
};

export const MobileWisdom = ({ SSRList, wisdom }) => {
  const [list, setList] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const setShow = usePlayerActionStore((state) => state.setShow);
  const { setNavBar } = useNavBarStore();

  useEffect(() => {
    setNavBar({
      title: "نکته‌ها و حکمت‌ها",
    });
  }, [setNavBar]);

  React.useEffect(() => {
    setList(SSRList.list);
    setDate(SSRList);
  }, [SSRList]);
  ``
  const handleEndLess = React.useCallback(async () => {
    setLoading(true);

    const response = WisdomReq({ page: (+data?.pagination?.page || +SSRList?.pagination?.page) + 1 })

    const li = await response?.json();

    setList((prv) => [...(prv || []), ...(li?.list || [])]);
    setData(list);
    setLoading(false);
  }, [list]);

  React.useEffect(() => {
    if (!!wisdom) {
      setShow(true, {
        video: wisdom?.file,
        wisdom: true,
        title: wisdom?.title,
        stringDuration: wisdom?.duration,
        stringSize: wisdom?.size,
      });
    }
  }, [wisdom, setShow]);

  return (
    <Container>
      <InfiniteScroll
        hasMore={true}
        dataLength={list?.length || 0}
        next={handleEndLess}
      >
        <Grid container spacing={2} sx={{ pt: 2, pb: 22 }}>
          {_.map(list, (item, index) => (
            <Grid size={{ xs: 12, sm: 12, md: 4 }} key={index}>
              <Section {...item} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </Container>
  );
};
