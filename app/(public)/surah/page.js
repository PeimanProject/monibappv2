"use client";
import { MobileVersePlayer } from "@/app/pages/player/mobileVersePlayer";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";

const VersePlayerContent = () => {
  const searchParams = useSearchParams();
  const viewport = "mobile";

  // Extract parameters from URL: ?surahId=1&verseId=5
  const surahId = searchParams.get("surahId");
  const verseId = searchParams.get("verseId");

  // States
  const [sr, setSr] = useState(null);
  const [series, setSeries] = useState(null);
  const [quranData, setQuranData] = useState(null);
  const [verse, setVerse] = useState(null);

  // 1. Fetch Series ID based on Surah
  const handleSrReq = async () => {
    if (!surahId) return;
    try {
      const req = await fetch(`https://core.monibapp.com/app/v2/verse/series/${surahId}`);
      const data = await req.json();
      setSr(data);
    } catch (e) { console.error(e); }
  };

  // 2. Fetch Series Details
  const handleSeriesReq = async (series_id) => {
    try {
      const seriesReq = await fetch(`${API().core}content/series/${series_id}`);
      const data = await seriesReq.json();
      setSeries(data);
    } catch (e) { console.error(e); }
  };

  // 3. Fetch Verse Details
  const handleVerseReq = async (series_id) => {
    try {
      const verseReq = await fetch(`${API().core}verse/${series_id}/${verseId}`);
      const data = await verseReq.json();
      setVerse(data);
    } catch (e) { console.error(e); }
  };

  // 4. Conditional Quran Data (Pages)
  const handleSeriesConditionalReq = async () => {
    try {
      const data = await fetch(`https://api.monibapp.ir/v3/service/quran/pages/?surahId=${Number(surahId) * -1}`);
      const res = await data.json();
      setQuranData(res);
    } catch (e) { console.error(e); }
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

  if (!sr || !series || !verse) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>;
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

