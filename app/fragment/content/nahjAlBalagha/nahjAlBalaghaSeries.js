"use client";

import React, { useEffect } from "react";
import { MobileSeries } from "../mobileSeries";
import { useNavBarStore } from "@/store/layout/useNavBarStore";

export const NahjAlBalaghaSeries = ({ list, viewport }) => {
  const { setNavBar } = useNavBarStore();

  useEffect(() => {
    setNavBar({
      title: "نهج البلاغه",
    });
  }, [setNavBar]);

  return (
    <>
      {viewport === "mobile" && <MobileSeries nhj {...list} />}
      {viewport === "desktop" && <MobileSeries nhj desktop {...list} />}
    </>
  );
};
