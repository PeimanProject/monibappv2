"use client";

import { ItemKey } from "@/app/component/seriesItemKey";
import { Container, Grid } from "@mui/material";
import Link from "next/link";
import React, { useEffect } from "react";
import _ from "lodash";
import { LastLectureContentKey } from "@/app/fragment/homeLastLecture/mobileHomeLastLecture";
import { useNavBarStore } from "@/store/layout/useNavBarStore";

export const MobileLastLecture = ({ list }) => {

  const { setNavBar } = useNavBarStore();

  useEffect(() => {
    setNavBar({
      title: "آخرین جلسات",
    });
  }, [setNavBar]);

  return (
    <Container maxWidth="md">
      <Grid container spacing={2} sx={{ pt: 3, pb: 22 }}>
        {_.map(_.take(list?.list, 100), (item, index) => (
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }} key={index}>
            <Link key={index} href={`/player/${item.id}`}>
              <ItemKey show={true}>
                <LastLectureContentKey {...item} />
              </ItemKey>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
