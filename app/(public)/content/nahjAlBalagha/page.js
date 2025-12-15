import { NahjAlBalaghaSeries } from "@/app/fragment/content/nahjAlBalagha/nahjAlBalaghaSeries";
import { getViewport } from "@/app/libs/isMobileDetect";
import { API } from "@/core/config/api";
import React from "react";

const NahjAlBalaghaPage = async () => {
  const contentReq = await fetch(`${API().core}content/3`);
  const list = await contentReq.json();
  const viewport = await getViewport();

  return <NahjAlBalaghaSeries list={list} viewport={viewport} />;
};

export default NahjAlBalaghaPage;
