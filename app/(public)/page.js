"use client";
import { MobileHomeActions } from "@/app/fragment/homeActions/mobileHomeActions";
import { HomeLastLecture } from "@/app/fragment/homeLastLecture/homeLastLecture";
import { MobileMainButtonsList } from "@/app/fragment/mainButtonsList/mobileMainButtonsList";
import { MobileSlider } from "@/app/fragment/slider/mobileSlider";
import { API } from "@/core/config/api";
import { Container, Typography } from "@mui/material";
import { HomeStore } from "./home";
import { useEffect, useState } from "react";

export default function Home() {
  const viewport = "mobile";
  const [homeData, setHomeData] = useState(null);
  const [list, setList] = useState(null)

  const handlehHomeDateReq = async () => {
    const homeDateReq = await fetch(`${API().core}home/?forceDetect=${viewport}`);
    const data = await homeDateReq.json();
    setHomeData(data);
  }
  const handleListReq = async () => {
    const listReq = await fetch(`${API().core}lastLecture/?size=4`);
    const data = await listReq.json();
    setList(data)
  }
  useEffect(() => {
    handlehHomeDateReq()
    handleListReq()
  }, [])



  if (!homeData && !list) {
    return <Typography m={5} textAlign={"center"}> در حال بارگذاری ...</Typography>
  }

  return (
    <>
      <HomeStore />
      <MobileSlider list={homeData?.sliders} />
      <Container maxWidth="sm" sx={{ pt: 1, pb: 20 }}>
        <MobileMainButtonsList data={homeData?.count} />
        <MobileHomeActions
          liveCounter={homeData?.liveCounter}
          isLive={homeData?.isLive}
        />
        <HomeLastLecture viewport="mobile" list={list} />
      </Container>
    </>
  );
}