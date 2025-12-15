import { getViewport } from "@/app/libs/isMobileDetect";
import React from "react";
import { MobileWisdom } from "@/app/pages/wisdom/mobileWisdom";
import { API } from "@/core/config/api";

const WisdomPage = async () => {
  const viewport = await getViewport();
  const listReq = await fetch(`${API().core}wisdom?page=0&size=100`);
  const list = await listReq.json();

  return (
    <>
      {viewport === "mobile" && <MobileWisdom SSRList={list} />}
      {viewport === "desktop" && <MobileWisdom SSRList={list} desktop />}
    </>
  );
};

export default WisdomPage;
