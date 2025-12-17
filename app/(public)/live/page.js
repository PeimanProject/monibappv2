"use client";
import React, { useEffect, useState } from "react";
import { MobileLive } from "@/app/pages/live/mobileLive";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";

const LivePage = () => {
  const [live, setLive] = useState(null)
  const [list, setList] = useState(null)

  const handleLiveReq = async () => {
    const req = await fetch(`${API().core}live`);
    const data = await req.json();
    setLive(data)
  }
  const handleListReq = async () => {
    const listReq = await fetch(`${API().core}lastLecture/?size=4`);
    const data = await listReq.json();

    setList(data)
  }
  useEffect(() => {
    handleLiveReq()
    handleListReq()
  }, [])
  if (!list || !live) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>
  }

  return <MobileLive live={live} lastLecture={list} />;
};

export default LivePage;
