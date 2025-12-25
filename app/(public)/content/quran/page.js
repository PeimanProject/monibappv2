"use client";
import { QuranSeries } from "@/app/fragment/content/quran/quranSeries";
import { API } from "@/core/config/api";
import { Box, Typography, Button } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const QuranPage = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "default";
  const [list, setList] = useState(undefined);


  const handleContentReq = async () => {
    setList(undefined)
    try {
      const contentReq = await fetch(`${API().core}content/1?type=${type}`);
      const data = await contentReq.json();
      setList(data)
    } catch (e) {
      setList(null)
    }

  }

  useEffect(() => {
    handleContentReq()
  }, [])

  if (list === undefined) return <Typography textAlign={"center"} m={5}>در حال بارگذاری ...</Typography>

  if (list === null) return (
    <Box sx={{
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
  )

  return <QuranSeries list={list} viewport={"mobile"} type={type} quran />;
};

export default function Page() {
  return (
    <Suspense fallback={<Typography m={5} textAlign={"center"} >در حال بارگذاری...</Typography>}>
      <QuranPage />
    </Suspense>
  );
}