import { GetOs } from "@/app/libs/getOs";
import { MobileSeries } from "@/app/pages/series/mobileSeries";
import { API } from "@/core/config/api";
import React from "react";


const SeriesPage = async ({ params, searchParams }) => {
  const { seriesId } = await params;
  let type = (await searchParams)?.type || "default";


  type = type === "undefined" ? "lecture" : type;

  const seriesReq = await fetch(`${API().core}content/series/${seriesId}`);
  const series = await seriesReq.json();

  let quranData = null;

  if (series?.mainId === 1) {
    const data = await fetch(
      `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${series.rId * -1
      }&less=true`
    );
    quranData = await data.json();
  }

  const os = GetOs();


  return <MobileSeries {...{ quranData, series, seriesId, type, os }} />
};

export default SeriesPage;
