"use client";
import { MobileVersePlayer } from "@/app/pages/player/mobileVersePlayer";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";

import React, { use, useEffect } from "react";

const VersePlayer = ({ params }) => {
  const viewport = "mobile";
  const { verseId, surahId } = use(params);
  //states
  const [sr, setSr] = useState(null);
  const [series, setSeries] = useState(null);
  const [quranData, setQuranData] = useState(null)
  const [verse, setVerse] = useState(null)

  const handleSrReq = async () => {
    const req = await fetch(
      `https://core.monibapp.com/app/v2/verse/series/${surahId}`
    );
    const data = await req.json();
    setSr(data)
  }

  const handleSeriesReq = async () => {
    const seriesReq = await fetch(`${API().core}content/series/${sr?.series_id}`);
    const data = await seriesReq.json();
    setSeries(data);
  }
  const handleSeriesConditionalReq = async () => {
    const data = await fetch(
      `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${surahId * -1}`
    );
    const res = await data.json();
    setQuranData(res)
  }

  const handleVerseReq = async () => {
    const verseReq = await fetch(
      `${API().core}verse/${sr?.series_id}/${verseId}`
    );
    const data = await verseReq.json();
    setVerse(data)

  }

  useEffect(() => {
    handleSrReq()
    handleSeriesReq()
    handleVerseReq()
  }, [])




  if (series?.mainId === 1) {
    handleSeriesConditionalReq()
  }

  if (!sr || !series || !verse) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>
  }
  return <MobileVersePlayer
    desktop={viewport === "desktop"}
    {...{ quranData, series, seriesId: sr?.series_id, verseId, verse }}
  />
};

export default VersePlayer;
