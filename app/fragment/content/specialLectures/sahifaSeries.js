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
  return <MobileSeries sp sahifa {...list} quran={quran} />
};
