"use client";
import { GetOs } from "@/app/libs/getOs";
import { MobilePlayer } from "@/app/pages/player/mobilePlayer";
import { API } from "@/core/config/api";
import { Box, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { Button } from "react-scroll";

// 1. Move the logic into a content component
const PlayerContent = () => {
  const searchParams = useSearchParams();

  // Extract all parameters from the URL
  const lectureId = searchParams.get("id"); // Now using ?id= instead of [lectureId]
  const mediaCurrent = searchParams.get("media") || null;
  const time = searchParams.get("time") || null;

  // States
  const [lecture, setLecture] = useState(undefined);
  const [quranData, setQuranData] = useState(undefined);
  const [srtArr, setSrtArr] = useState(undefined);
  const [srtEnArr, setSrtEnArr] = useState(undefined);

  // Handlers
  const handleGetLecture = async () => {
    if (!lectureId) return;
    try {
      const req = await fetch(`${API().core}content/lecture/${lectureId}`);
      const data = await req.json();
      setLecture(data);
    } catch (error) {
      setLecture(null)
      console.error("Error fetching lecture:", error);
    }
  };

  const handleGetQuranData = async () => {
    try {
      const data = await fetch(
        `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${lecture.contextId * -1}&less=true`
      );
      const res = await data.json();
      setQuranData(res);
    } catch (error) {
      setQuranData(null)
      console.error("Error fetching Quran data:", error);
    }
  };

  const handleGetSrtArr = async () => {
    try {
      const listJson = await fetch(
        `https://bundles.monibapp.ir/srt_json/${lectureId}/?filename=${lecture?.srt?.fileName}`
      );
      const data = await listJson.json();
      setSrtArr(data);
    } catch (error) {
      setSrtArr(null)
      console.error("Error fetching SRT:", error);
    }
  };

  const handleGetEnSrtArr = async () => {
    try {
      const listJson = await fetch(
        `https://bundles.monibapp.ir/srt_json/${lectureId}/?filename=${lecture?.srt_en?.fileName}`
      );
      const data = await listJson.json();
      setSrtEnArr(data);
    } catch (error) {
      setSrtEnArr(null)
      console.error("Error fetching English SRT:", error);
    }
  };

  // Init fetch
  useEffect(() => {
    handleGetLecture();
  }, [lectureId]); // Re-fetch if the ID in the URL changes

  useEffect(() => {
    if (lecture) {
      if (lecture?.mainId === 1) {
        handleGetQuranData();
      }
      if (lecture?.srt?.serverSrc) {
        handleGetSrtArr();
      }
      if (lecture?.srt_en?.serverSrc) {
        handleGetEnSrtArr();
      }
    }
  }, [lecture]);

  const os = GetOs();

  if (!lectureId) {
    return <Typography textAlign={"center"} m={5}>شناسه یافت نشد.</Typography>;
  }

  if (lecture === undefined) {
    return <Typography textAlign={"center"} m={5}>در حال بارگذاری...</Typography>;
  }

  if (lecture === null) {
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
      <Button onClick={() => { handleGetLecture() }} variant="contained">تلاش دوباره</Button>
    </Box>
  }

  return (
    <MobilePlayer
      {...{ srtArr, quranData, lecture, srtEnArr, os, mediaCurrent, time }}
    />
  );
};

// 2. Wrap in Suspense for static export compatibility
export default function PlayerPage() {
  return (
    <Suspense fallback={<Typography textAlign={"center"} m={5}>در حال بارگذاری...</Typography>}>
      <PlayerContent />
    </Suspense>
  );
}