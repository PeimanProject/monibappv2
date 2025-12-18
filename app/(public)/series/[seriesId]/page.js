"use client"
import { GetOs } from "@/app/libs/getOs";
import { MobileSeries } from "@/app/pages/series/mobileSeries";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";


const SeriesPage = ({ params }) => {
  const searchParams = useSearchParams()
  const { seriesId } = use(params);
  let type = searchParams.get("type") || "default";


  type = type === "undefined" ? "lecture" : type;

  const [series, setSeries] = useState(null)
  const [quranData, setqQuranData] = useState(null)

  const handleSeriesReq = async () => {

    const seriesReq = await fetch(`${API().core}content/series/${seriesId}`);
    const data = await seriesReq.json();
    setSeries(data)
  }

  const handleQuranDataReq = async () => {
    const res = await fetch(
      `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${series.rId * -1
      }&less=true`
    );
    const data = await res.json();
    setqQuranData(data)
  }

  useEffect(() => {
    handleSeriesReq()
  }, [])
  if (series?.mainId === 1) {
    handleQuranDataReq()
  }

  const os = GetOs();


  if (!series) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>
  }

  return <MobileSeries {...{ quranData, series, seriesId, type, os }} />
};

export default SeriesPage;
