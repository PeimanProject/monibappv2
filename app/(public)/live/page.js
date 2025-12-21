"use client";
import React, { useEffect, useState } from "react";
import { MobileLive } from "@/app/pages/live/mobileLive";
import { API } from "@/core/config/api";
import { Typography, Button, Box } from "@mui/material";

const LivePage = () => {
  const [live, setLive] = useState(undefined)
  const [list, setList] = useState(undefined)

  const handleLiveReq = async () => {
    try {
      const req = await fetch(`${API().core}live`);
      const data = await req.json();
      setLive(data)
    } catch (e) {
      setLive(null)
    }
  }
  const handleListReq = async () => {
    try {
      const listReq = await fetch(`${API().core}lastLecture/?size=4`);
      const data = await listReq.json();
      setList(data)
    } catch (e) {
      setList(null)
    }

  }
  useEffect(() => {
    handleLiveReq()
    handleListReq()
  }, [])
  if (list === undefined || live === undefined) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>
  }

  if (list === null || live === null) {
    return <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      gap: 2,
    }}>
      <Typography>خطایی رخ داده است</Typography>
      <Typography>لطفا اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید</Typography>
      <Button onClick={() => { handleLiveReq(); handleListReq() }} variant="contained">تلاش دوباره</Button>
    </Box>
  }

  return <MobileLive live={live} lastLecture={list} />;
};

export default LivePage;
