"use client";
import { GetOs } from "@/app/libs/getOs";
import { MobileSeries } from "@/app/pages/series/mobileSeries";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";

const SeriesContent = () => {
  const searchParams = useSearchParams();

  // Extract parameters from URL: ?id=123&type=lecture
  const seriesId = searchParams.get("seriesId");
  let typeParam = searchParams.get("type") || "default";
  const type = typeParam === "undefined" ? "lecture" : typeParam;

  const [series, setSeries] = useState(null);
  const [quranData, setQuranData] = useState(null);

  // Handlers
  const handleSeriesReq = async () => {
    if (!seriesId) return;
    try {
      const seriesReq = await fetch(`${API().core}content/series/${seriesId}`);
      const data = await seriesReq.json();
      setSeries(data);
    } catch (error) {
      console.error("Error fetching series:", error);
    }
  };

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
    handleSeriesReq();
  }, [seriesId]);

  useEffect(() => {
    // Check if we need Quran data once series is loaded
    if (series?.mainId === 1 && series?.rId) {
      handleQuranDataReq(series.rId);
    }
  }, [series]);

  const os = GetOs();

  if (!seriesId) {
    return <Typography m={5} textAlign={"center"}>شناسه مجموعه یافت نشد</Typography>;
  }

  if (!series) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>;
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