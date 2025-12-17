"use client";
import { MobileVersePlayer } from "@/app/pages/player/mobileVersePlayer";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";
import React, { use, useEffect, useState } from "react";

const VersePlayer = ({ params }) => {
  const { verseId, seriesId } = use(params);

  //states
  const [series, setSeries] = useState(null);
  const [quranData, setQuranData] = useState(null)
  const [verse, setVerse] = useState(null)

  const handleSeriesReq = async () => {
    const seriesReq = await fetch(`${API().core}content/series/${seriesId}`);
    const data = await seriesReq.json();
    setSeries(data)
  }

  const handleSeriesConditionalReq = async () => {

    const data = await fetch(
      `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${series.rId * -1
      }`
    );
    const res = await data.json();
    setQuranData(res)
  }

  const handleVerseReq = async () => {
    const verseReq = await fetch(`${API().core}verse/${seriesId}/${verseId}`);
    const data = await verseReq.json();
    setVerse(data)
  }


  useEffect(() => {
    handleSeriesReq()
    handleVerseReq()
  }, [])

  if (series?.mainId === 1) {
    handleSeriesConditionalReq()
  }


  if (!series, !verse) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>
  }


  return <MobileVersePlayer
    {...{ quranData, series, seriesId, verseId, verse }}
  />
};

export default VersePlayer;
