"use client"
import { NahjAlBalaghaSeries } from "@/app/fragment/content/nahjAlBalagha/nahjAlBalaghaSeries";
import { API } from "@/core/config/api";
import { Typography, Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";

const NahjAlBalaghaPage = () => {
  const viewport = "mobile"
  const [list, setList] = useState(undefined)
  const handleContentReq = async () => {
    setList(undefined)
    try {
      const contentReq = await fetch(`${API().core}content/3`);
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

  if (list === undefined) return <Typography m={5} textAlign={"center"}>در حال بارگزاری ...</Typography>
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
  return <NahjAlBalaghaSeries list={list} viewport={viewport} />;
};

export default NahjAlBalaghaPage;
