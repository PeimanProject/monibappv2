import { getViewport } from "@/app/libs/isMobileDetect";
import { MobileLastLecture } from "@/app/pages/last/mobileLastLecture";
import { API } from "@/core/config/api";
import React from "react";

 const LastLecturePage = async () => {
  const viewport = await getViewport();
  const listReq = await fetch(`${API().core}lastLecture/?size=100`);
  const list = await listReq.json();

  return (
    <>
      {viewport === "mobile" && <MobileLastLecture list={list} />}
      {viewport === "desktop" && <MobileLastLecture list={list} desktop />}
    </>
  );
};

export default LastLecturePage;