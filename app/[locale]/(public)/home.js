"use client";

import React, { useEffect } from "react";
import { useNavBarStore } from "@/store/layout/useNavBarStore";

export const HomeStore = () => {
  const { setNavBar } = useNavBarStore();

  useEffect(() => {
    setNavBar(null);
  }, []);

  return <></>;
};
