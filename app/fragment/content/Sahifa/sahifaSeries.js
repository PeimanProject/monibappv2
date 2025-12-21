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


  return <MobileSeries sahifa  {...list} />;
};
