
import { SpecialLecturesSeries } from "@/app/fragment/content/specialLectures/sahifaSeries";
import { getViewport } from "@/app/libs/isMobileDetect";
import { API } from "@/core/config/api";
import React from "react";

const SahifaPage = async () => {
  const contentReq = await fetch(`${API().core}content/5`);
  const list = await contentReq.json();
  const viewport = await getViewport();

  return <SpecialLecturesSeries list={list} viewport={viewport} quran />;
};

export default SahifaPage;
