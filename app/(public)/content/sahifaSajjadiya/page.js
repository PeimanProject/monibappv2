"use client"
import { SahifaSeries } from "@/app/fragment/content/Sahifa/sahifaSeries";
import { db } from "@/app/libs/db";
import { API } from "@/core/config/api";
import { useConnectivity } from "@/core/ConnectivityProvider";
import { Typography, Box, Button } from "@mui/material";
import Dexie from "dexie";
import React, { useEffect, useState } from "react";

const SahifaPage = () => {
  const { isConnected } = useConnectivity()
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
  const loadOfflineData = async () => {
    try {
      // فیلتر کردن دیتابیس بر اساس main_id نهج‌البلاغه
      const offlineSeries = await db.series
        .where('[mainId+rowId]')
        .between([4, Dexie.minKey], [4, Dexie.maxKey])
        .toArray();

      if (offlineSeries.length > 0) {
        // بازسازی فرمت دیتا برای کامپوننت Series
        const formattedData = {
          "main_id": 4,
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
    {/* <Button onClick={handleContentReq} variant="contained">تلاش دوباره</Button> */}
  </Box>)



  return <SahifaSeries list={list} viewport={viewport} />;
};

export default SahifaPage;
