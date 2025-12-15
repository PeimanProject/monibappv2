
import { SahifaSeries } from "@/app/fragment/content/Sahifa/sahifaSeries";
import { getViewport } from "@/app/libs/isMobileDetect";
import { API } from "@/core/config/api";
import React from "react";

const SahifaPage = async () => {
  const contentReq = await fetch(`${API().core}content/4`);
  const list = await contentReq.json();
  const viewport = await getViewport();

  return <SahifaSeries list={list} viewport={viewport} />;
};

export default SahifaPage;
