"use client";
import { QuranSeries } from "@/app/fragment/content/quran/quranSeries";
import { db } from "@/app/libs/db";
import { API } from "@/core/config/api";
import { useConnectivity } from "@/core/ConnectivityProvider";
import { Box, Typography, Button } from "@mui/material";
import Dexie from "dexie";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const QuranPage = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "default";
  const [list, setList] = useState(undefined);
  const { isConnected } = useConnectivity(); // وضعیت اینترنت


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
  const loadFromOffline = async () => {
    try {
      // فیلتر کردن تمام رکوردهایی که مربوط به قرآن (main_id: 1) هستند
      const offlineData = await db.series
        .where('[mainId+rowId]')
        .between([1, Dexie.minKey], [1, Dexie.maxKey])
        .toArray();
      if (offlineData.length > 0) {
        setList({ "mainId": 1, "list": offlineData });
      } else {
        setList(null); // هیچ دیتایی حتی در دیتابیس نیست
      }
    } catch (error) {
      console.error("Offline DB fetch failed:", error);
      setList(null);
    }
  };
  useEffect(() => {
    const load = async () => {
      if (isConnected) {
        await handleContentReq();
      } else {
        await loadFromOffline();
      }
    }
    load()
  }, [isConnected, type]); // اگر وضعیت اینترنت تغییر کرد، دوباره تلاش کن

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
      {/* <Button onClick={load} variant="contained">تلاش دوباره</Button> */}
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