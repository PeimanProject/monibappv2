import React from "react";
import { getViewport } from "@/app/libs/isMobileDetect";
import { MobileLive } from "@/app/pages/live/mobileLive";
import { API } from "@/core/config/api";

const LivePage = async () => {
  const req = await fetch(`${API().core}live`);
  const live = await req.json();

  const listReq = await fetch(`${API().core}lastLecture/?size=4`);
  const list = await listReq.json();

  const viewport = await getViewport();

  if (viewport === "mobile") {
    return <MobileLive live={live} lastLecture={list} />;
  }
  return <MobileLive live={live} lastLecture={list} desktop />;
};

export default LivePage;
