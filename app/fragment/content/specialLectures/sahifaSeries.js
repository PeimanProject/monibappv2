"use client";

import React, { useEffect } from "react";
import { MobileSeries } from "../mobileSeries";
import { useNavBarStore } from "@/store/layout/useNavBarStore";

export const SpecialLecturesSeries = ({ list, viewport, quran }) => {
  const { setNavBar } = useNavBarStore();

  useEffect(() => {
    setNavBar({
      title: "گفتارهای ویژه",
    });
  }, [setNavBar]);
  return (
    <>
      {viewport === "mobile" && <MobileSeries sp sahifa {...list} quran={quran} />}
      {viewport === "desktop" && <MobileSeries sp sahifa desktop {...list} quran={quran} />}
    </>
  );
};
