"use client";
import { QuranText } from "@/app/pages/series/quranText";
import { Typography } from "@mui/material";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// 1. Logic moved to a child component to support Suspense
const QuranContent = () => {
  const searchParams = useSearchParams();

  // Extract parameters from URL: ?id=1&name=Al-Fatiha
  const surahId = searchParams.get("surahId");
  const initialSurahName = searchParams.get("surahName");

  const [quranData, setQuranData] = useState(null);
  const [surahName, setSurahName] = useState(initialSurahName);

  const handleQuranData = async () => {
    if (!surahId) return;
    try {
      const data = await fetch(
        `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${Number(surahId) * -1}&less=true`
      );
      const res = await data.json();
      setQuranData(res);
    } catch (error) {
      console.error("Error fetching Quran data:", error);
    }
  };

  const handleSurahName = async () => {
    if (!surahId) return;
    try {
      const res = await fetch(
        `https://api.monibapp.ir/v3/service/quran?id=${surahId}`
      );
      const data = (await res.json())?.surah;
      setSurahName(data);
    } catch (error) {
      console.error("Error fetching Surah name:", error);
    }
  };

  useEffect(() => {
    if (surahId) {
      handleQuranData();
      handleSurahName();
    }
  }, [surahId]);

  if (!surahId) {
    return <Typography m={5} textAlign={"center"}>شناسه سوره یافت نشد</Typography>;
  }

  if (!quranData || !surahName) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>;
  }

  return <QuranText {...{ quranData, surahId, surahName }} />;
};

// 2. Main export wrapped in Suspense for Next.js static export
export default function Page() {
  return (
    <Suspense fallback={<Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>}>
      <QuranContent />
    </Suspense>
  );
}