"use client";
import { QuranSeries } from "@/app/fragment/content/quran/quranSeries";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const QuranPage = ({ searchParams } = {}) => {
  const [list, setList] = useState(null);
  // const type = (await searchParams)?.type || "default";
  const type = "default";


  const handleContentReq = async () => {
    const contentReq = await fetch(`${API().core}content/1?type=${type}`);
    const data = await contentReq.json();
    setList(data)
  }

  useEffect(() => {
    handleContentReq()
  }, [])

  if (!list) return <Typography textAlign={"center"} m={5}>در حال بارگذاری ...</Typography>

  return <QuranSeries list={list} viewport={"mobile"} type={type} quran />;
};

export default QuranPage;
