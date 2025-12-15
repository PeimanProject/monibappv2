import React from "react";
import { API } from "@/core/config/api";
import { MobileHomeLastLecture } from "./mobileHomeLastLecture";

export const HomeLastLecture = async ({ viewport }) => {
  const listReq = await fetch(`${API().core}lastLecture/?size=4`);
  const list = await listReq.json();

  return (
    <>
      {viewport === "desktop" && <MobileHomeLastLecture list={list} />}
      {viewport === "mobile" && <MobileHomeLastLecture list={list} />}
    </>
  );
};
