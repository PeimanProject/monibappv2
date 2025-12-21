"use client";
import { MobileHomeActions } from "@/app/fragment/homeActions/mobileHomeActions";
import { HomeLastLecture } from "@/app/fragment/homeLastLecture/homeLastLecture";
import { MobileMainButtonsList } from "@/app/fragment/mainButtonsList/mobileMainButtonsList";
import { MobileSlider } from "@/app/fragment/slider/mobileSlider";
import { API } from "@/core/config/api";
import { Container, Typography, Button, Box } from "@mui/material";
import { HomeStore } from "./home";
import { useEffect, useState } from "react";

export default function Home() {
  const viewport = "mobile";
  const [homeData, setHomeData] = useState(undefined);
  const [list, setList] = useState(undefined)
  const [loading, setLoading] = useState(true)

  const handlehHomeDateReq = async () => {
    try {
      const homeDateReq = await fetch(`${API().core}home/?forceDetect=${viewport}`);
      const data = await homeDateReq.json();
      setHomeData(data);
      setLoading(false)
    } catch (e) {
      setHomeData(null);
      setLoading(false)
      console.error(e);
    }
  }
  const handleListReq = async () => {
    try {
      const listReq = await fetch(`${API().core}lastLecture/?size=4`);
      const data = await listReq.json();
      setList(data)
      setLoading(false)
    } catch (e) {
      setList(null);
      setLoading(false)
      console.error(e);
    }

  }
  useEffect(() => {
    handlehHomeDateReq()
    handleListReq()
  }, [])



  if (loading) {
    return <Typography m={5} textAlign={"center"}> در حال بارگذاری ...</Typography>
  }
  if ((homeData === null || list === null) && !loading) {
    return (
      <Box sx={{ display: "flex", gap: 2, flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Typography textAlign={"center"}> خطایی رخ داده است</Typography>
        <Typography textAlign={"center"}>لطفا از اتصال اینترنت خود مطمئن شوید و دوباره تلاش کنید</Typography>
        <Button onClick={() => { setLoading(true); handlehHomeDateReq(); handleListReq(); }}>
          تلاش دوباره
        </Button>
      </Box>
    )
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