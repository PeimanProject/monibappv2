"use client";
import { MobileVersePlayer } from "@/app/pages/player/mobileVersePlayer";
import { API } from "@/core/config/api";
import { Box, Button, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";

const VersePlayerContent = () => {
  const searchParams = useSearchParams();

  // Extract parameters from URL: ?seriesId=123&verseId=456
  const seriesId = searchParams.get("seriesId");
  const verseId = searchParams.get("verseId");

  // States
  const [series, setSeries] = useState(undefined);
  const [quranData, setQuranData] = useState(undefined);
  const [verse, setVerse] = useState(undefined);

  // Handler: Fetch Series Details
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

  // Handler: Fetch Quran Pages (Conditional)
  const handleSeriesConditionalReq = async (rId) => {
    try {
      const data = await fetch(
        `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${rId * -1}`
      );
      const res = await data.json();
      setQuranData(res);
    } catch (error) {
      setQuranData(null)
      console.error("Error fetching Quran data:", error);
    }
  };

  // Handler: Fetch Specific Verse
  const handleVerseReq = async () => {
    setVerse(undefined)
    if (!seriesId || !verseId) return;
    try {
      const verseReq = await fetch(`${API().core}verse/${seriesId}/${verseId}`);
      const data = await verseReq.json();
      setVerse(data);
    } catch (error) {
      setVerse(null)
      console.error("Error fetching verse:", error);
    }
  };

  // Effect 1: Initial Data Load
  useEffect(() => {
    handleSeriesReq();
    handleVerseReq();
  }, [seriesId, verseId]);

  // Effect 2: Secondary Data Load (Conditional)
  useEffect(() => {
    if (series?.mainId === 1 && series?.rId) {
      handleSeriesConditionalReq(series.rId);
    }
  }, [series]);

  // Validation
  if (!seriesId || !verseId) {
    return <Typography m={5} textAlign={"center"}>شناسه وارد شده صحیح نیست</Typography>;
  }

  if (series === undefined || verse === undefined) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>;
  }

  if (series === null || verse === null) {
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
      <Button onClick={() => { handleSeriesReq(); handleVerseReq() }} variant="contained">تلاش دوباره</Button>
    </Box>;
  }

  return (
    <MobileVersePlayer
      {...{ quranData, series, seriesId, verseId, verse }}
    />
  );
};

// Main Export with Suspense
export default function VersePlayerPage() {
  return (
    <Suspense fallback={<Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>}>
      <VersePlayerContent />
    </Suspense>
  );
}