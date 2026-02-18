"use client"
import { SpecialLecturesSeries } from "@/app/fragment/content/specialLectures/sahifaSeries";
import { db } from "@/app/libs/db";
import { API } from "@/core/config/api";
import { useConnectivity } from "@/core/ConnectivityProvider";
import { Box, Typography, Button } from "@mui/material";
import Dexie from "dexie";
import React, { useState, useEffect } from "react";

const SahifaPage = () => {
  const { isConnected } = useConnectivity()
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
  const loadOfflineData = async () => {
    try {
      // فیلتر کردن دیتابیس بر اساس main_id نهج‌البلاغه
      const offlineSeries = await db.series
        .where("mainId")
        .equals(5)
        .toArray();

      if (offlineSeries.length > 0) {
        // بازسازی فرمت دیتا برای کامپوننت Series
        const formattedData = {
          "main_id": 5,
          "list": offlineSeries
        }
        setList(formattedData);
      } else {
        setList(null); // هیچ دیتایی در دیتابیس هم نبود
      }
    } catch (e) {
      console.error("Dexie error:", e);
      setList(null);
    }
  };
  useEffect(() => {
    if (isConnected) {
      handleContentReq()
    } else {
      loadOfflineData()
    }
  }, [isConnected])

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
    {/* <Button onClick={handleContentReq} variant="contained">تلاش دوباره</Button> */}
  </Box>
  return <SpecialLecturesSeries list={list} viewport={viewport} quran />;
};

export default SahifaPage;
