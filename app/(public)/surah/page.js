"use client";
import { MobileVersePlayer } from "@/app/pages/player/mobileVersePlayer";
import { API } from "@/core/config/api";
import { Box, Button, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";

const VersePlayerContent = () => {
  const searchParams = useSearchParams();
  const viewport = "mobile";
  const router = useRouter()
  // Extract parameters from URL: ?surahId=1&verseId=5
  const surahId = searchParams.get("surahId");
  const verseId = searchParams.get("verseId");

  // States
  const [sr, setSr] = useState(undefined);
  const [series, setSeries] = useState(undefined);
  const [quranData, setQuranData] = useState(undefined);
  const [verse, setVerse] = useState(undefined);

  // 1. Fetch Series ID based on Surah
  const handleSrReq = async () => {
    setSr(undefined)
    if (!surahId) return;
    try {
      const req = await fetch(`https://core.monibapp.com/app/v2/verse/series/${surahId}`);
      const data = await req.json();
      setSr(data);
    } catch (e) {
      setSr(null)
      console.error(e);
    }
  };

  // 2. Fetch Series Details
  const handleSeriesReq = async (series_id) => {
    setSeries(undefined)
    try {
      const seriesReq = await fetch(`${API().core}content/series/${series_id}`);
      const data = await seriesReq.json();
      setSeries(data);
    } catch (e) {
      setSeries(null)
      console.error(e);
    }
  };

  // 3. Fetch Verse Details
  const handleVerseReq = async (series_id) => {
    setVerse(undefined)
    try {
      const verseReq = await fetch(`${API().core}verse/${series_id}/${verseId}`);
      const data = await verseReq.json();
      setVerse(data);
    } catch (e) {
      setVerse(null)
      console.error(e);
    }
  };

  // 4. Conditional Quran Data (Pages)
  const handleSeriesConditionalReq = async () => {
    setQuranData(undefined)
    try {
      const data = await fetch(`https://api.monibapp.ir/v3/service/quran/pages/?surahId=${Number(surahId) * -1}`);
      const res = await data.json();
      setQuranData(res);
    } catch (e) {
      setQuranData(null)
      console.error(e);
    }
  };

  // Initial load
  useEffect(() => {
    handleSrReq();
  }, [surahId]);

  // Chain fetches based on 'sr' results
  useEffect(() => {
    if (sr?.series_id) {
      handleSeriesReq(sr.series_id);
      handleVerseReq(sr.series_id);
    }
  }, [sr, verseId]);

  // Handle conditional Quran data
  useEffect(() => {
    if (series?.mainId === 1 && surahId) {
      handleSeriesConditionalReq();
    }
  }, [series, surahId]);

  if (!surahId || !verseId) {
    return <Typography m={5} textAlign={"center"}>اطلاعات وارد شده ناقص است</Typography>;
  }

  if (sr == undefined) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>;
  }
  if (sr == null) {
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
      <Button onClick={() => { router.refresh() }} variant="contained">تلاش دوباره</Button>
    </Box>;
  }

  return (
    <MobileVersePlayer
      desktop={viewport === "desktop"}
      {...{ quranData, series, seriesId: sr?.series_id, verseId, verse }}
    />
  );
};

// Main Export with Suspense for Next.js Export
export default function VersePlayer() {
  return (
    <Suspense fallback={<Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>}>
      <VersePlayerContent />
    </Suspense>
  );
}