"use client";

import { useVerseDataStore } from "@/store/useVerseData";
import { usePathname } from "next/navigation";
import React from "react";

export const EventLayout = () => {
  const path = usePathname();
  const { setVerse } = useVerseDataStore();

  React.useEffect(() => setVerse(null, null, null), [path]);

  return <></>;
};
