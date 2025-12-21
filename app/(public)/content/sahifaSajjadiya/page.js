"use client"
import { SahifaSeries } from "@/app/fragment/content/Sahifa/sahifaSeries";
import { API } from "@/core/config/api";
import { Typography, Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";

const SahifaPage = () => {
  const viewport = "mobile";
  const [list, setList] = useState(undefined)
  const handleContentReq = async () => {
    setList(undefined)
    try {
      const contentReq = await fetch(`${API().core}content/4`);
      const data = await contentReq.json();
      setList(data);
    } catch (e) {
      console.log(e);
      setList(null)
    }
  }


  useEffect(() => {
    handleContentReq()
  }, [])

  if (list === undefined) return <Typography textAlign={"center"} m={5}>در حال بارگذاری ...</Typography>
  if (list === null) return (<Box sx={{
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
  </Box>)



  return <SahifaSeries list={list} viewport={viewport} />;
};

export default SahifaPage;
