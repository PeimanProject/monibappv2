"use client";
import { GetOs } from "@/app/libs/getOs";
import { MobilePlayer } from "@/app/pages/player/mobilePlayer";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";

const PlayerPage = ({
  params,
}) => {
  const searchParams = useSearchParams()
  const { lectureId } = use(params);
  const mediaCurrent = searchParams.get("media") || null; // Extract 'media' query parameter
  const time = searchParams.get("time") || null; // Extract 'media' query parameter
  //states
  const [lecture, setLecture] = useState(null)
  const [quranData, setQuranData] = useState(null)
  const [srtArr, setSrtArr] = useState(null)
  const [srtEnArr, setSrtEnArr] = useState(null)

  //handlers
  const handleGetLecture = async () => {
    const req = await fetch(`${API().core}content/lecture/${lectureId}`);
    const data = await req.json();
    setLecture(data)
  }
  const handleGetQuranData = async () => {
    const data = await fetch(
      `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${lecture.contextId * -1
      }&less=true`
    );
    const res = await data.json();
    setQuranData(res)
  }

  const handleGetSrtArr = async () => {
    const listJson = await fetch(
      `https://bundles.monibapp.ir/srt_json/${lectureId}/?filename=${lecture?.srt?.fileName}`
    );
    const data = await listJson.json();
    setSrtArr(data)
  }
  const handleGetEnSrtArr = async () => {
    const listJson = await fetch(
      `https://bundles.monibapp.ir/srt_json/${lectureId}/?filename=${lecture?.srt_en?.fileName}`
    );
    const data = await listJson.json();
    setSrtEnArr(data)
  }

  //init fetch
  useEffect(() => {
    handleGetLecture()
  }, [])

  useEffect(() => {
    if (lecture) {
      if (lecture?.mainId === 1) {
        handleGetQuranData()
      }

      if (!!lecture?.srt?.serverSrc) {
        handleGetSrtArr()
      }

      if (!!lecture?.srt_en?.serverSrc) {
        handleGetEnSrtArr()
      }
    }
  }, [
    lecture
  ])



  const os = GetOs();

  if (!lecture) {
    return <Typography textAlign={"center"} m={5}>در حال بارگذاری...</Typography>
  }
  return (
    <MobilePlayer
      {...{ srtArr, quranData, lecture, srtEnArr, os, mediaCurrent, time }}
    />
  )
};

export default PlayerPage;
