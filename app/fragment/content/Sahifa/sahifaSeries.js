"use client";

import React, { useEffect } from "react";
import { MobileSeries } from "../mobileSeries";
import { useNavBarStore } from "@/store/layout/useNavBarStore";

export const SahifaSeries = ({ list, viewport }) => {

  const { setNavBar } = useNavBarStore();

  useEffect(() => {
    setNavBar({
      title: "صحیفه سجادیه",
    });
  }, [setNavBar]);


  return (
    <>
      {viewport === "mobile" && <MobileSeries sahifa  {...list} />}
      {viewport === "desktop" && <MobileSeries sahifa desktop {...list} />}
    </>
  );
};
