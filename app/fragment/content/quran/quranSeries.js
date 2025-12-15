"use client";

import React, { useEffect } from "react";
import { MobileSeries } from "../mobileSeries";
import { useNavBarStore } from "@/store/layout/useNavBarStore";

export const QuranSeries = ({ list, viewport, type, quran }) => {
  const { setNavBar } = useNavBarStore();

  useEffect(() => {
    setNavBar({
      title: "قرآن کریم",
      back: true,
    });
  }, []);

  return (
    <>
      <MobileSeries {...list} type={type} quran={quran} desktop={viewport === "desktop"} />
    </>
  );
};
