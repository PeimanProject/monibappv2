"use client";
import { db } from "@/app/libs/db";
import { GetOs } from "@/app/libs/getOs";
import { MobileSeries } from "@/app/pages/series/mobileSeries";
import { API } from "@/core/config/api";
import { useConnectivity } from "@/core/ConnectivityProvider";
import { Box, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";

const SeriesContent = () => {
  const searchParams = useSearchParams();
  const { isConnected } = useConnectivity()
  // Extract parameters from URL: ?id=123&type=lecture
  const seriesId = searchParams.get("seriesId");
  let typeParam = searchParams.get("type") || "default";
  const type = typeParam === "undefined" ? "lecture" : typeParam;

  const [series, setSeries] = useState(undefined);
  const [quranData, setQuranData] = useState(null);

  // Handlers
  const handleSeriesReq = async () => {
    setSeries(undefined)
    if (!seriesId) return;
    try {
      const seriesReq = await fetch(`${API().core}content/series/${seriesId}`);
      const data = await seriesReq.json();
      setSeries(data);
    } catch (error) {
      setSeries(null)
      console.error("Error fetching series:", error);
    }
  };
  const handleSeriesReqOffline = async () => {
    setSeries(undefined)
    try {
      const seriesdb = await db.lectures.where("series_id").equals(Number(seriesId)).toArray();
      const data = {
        lectureList: seriesdb
      }
      setSeries(data);
    } catch (error) {
      setSeries(null)
      console.error("Error fetching series offline:", error);
    }
  }

  const handleQuranDataReq = async (rId) => {
    try {
      const res = await fetch(
        `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${rId * -1}&less=true`
      );
      const data = await res.json();
      setQuranData(data);
    } catch (error) {
      console.error("Error fetching Quran data:", error);
    }
  };

  // Lifecycle
  useEffect(() => {
    const load = async () => {
      if (isConnected) {
        await handleSeriesReq();
      } else {
        await handleSeriesReqOffline()
      }
    }
    load()
  }, [seriesId, isConnected]);

  useEffect(() => {
    // Check if we need Quran data once series is loaded
    if (series?.mainId === 1 && series?.rId && isConnected) {
      handleQuranDataReq(series.rId);
    }
  }, [series]);

  const os = GetOs();

  if (!seriesId) {
    return <Typography m={5} textAlign={"center"}>شناسه مجموعه یافت نشد</Typography>;
  }

  if (series == undefined) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>;
  }
  if (series == null) {
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
      {/* <Button onClick={() => { handleSeriesReq() }} variant="contained">تلاش دوباره</Button> */}
    </Box>;
  }

  return <MobileSeries {...{ quranData, series, seriesId, type, os }} />;
};

// Main Export with Suspense
export default function SeriesPage() {
  return (
    <Suspense fallback={<Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>}>
      <SeriesContent />
    </Suspense>
  );
}