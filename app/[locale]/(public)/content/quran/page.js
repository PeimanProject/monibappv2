import { QuranSeries } from "@/app/fragment/content/quran/quranSeries";
import { getViewport } from "@/app/libs/isMobileDetect";
import { API } from "@/core/config/api";
import React from "react";

const QuranPage = async ({ searchParams } = {}) => {
  const type = (await searchParams)?.type || "default";
  const contentReq = await fetch(`${API().core}content/1?type=${type}`);
  const list = await contentReq.json();
  const viewport = await getViewport();

  return <QuranSeries list={list} viewport={viewport} type={type} quran />;
};

export default QuranPage;
