"use client"
import { SpecialLecturesSeries } from "@/app/fragment/content/specialLectures/sahifaSeries";
import { API } from "@/core/config/api";
import { Box, Typography, Button } from "@mui/material";
import React, { useState, useEffect } from "react";

const SahifaPage = () => {
  const viewport = "mobile";
  const [list, setList] = useState(undefined)
  const handleContentReq = async () => {
    setList(undefined)
    try {
      const contentReq = await fetch(`${API().core}content/5`);
      const data = await contentReq.json();
      setList(data)
    } catch (error) {
      setList(null)
      console.log(error)
    }
  }
  useEffect(() => {
    handleContentReq()
  }, [])

  if (list === undefined) return <Typography textAlign={"center"} m={5}>در حال بارگذاری ...</Typography>
  if (list === null) return <Box sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: 2,
  }}>
    <Typography>خطایی رخ داده است</Typography>
    <Typography>لطفا اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید</Typography>
    <Button onClick={handleContentReq} variant="contained">تلاش دوباره</Button>
  </Box>
  return <SpecialLecturesSeries list={list} viewport={viewport} quran />;
};

export default SahifaPage;
