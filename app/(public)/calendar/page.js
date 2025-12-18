"use client";
import { MobileCalendar } from "@/app/fragment/calendar/mobileCalendar";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const CalendarContent = () => {
  const searchParams = useSearchParams();
  // Get year from URL (?year=1404), default to 1404
  const year = searchParams.get("year") || "1404";
  const [list, setList] = useState(null);

  useEffect(() => {
    const handleListReq = async () => {
      try {
        const contentReq = await fetch(`${API().core}content/lecture/${year}/year`);
        const data = await contentReq.json();
        setList(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    handleListReq();
  }, [year]); // Re-run when year changes

  if (!list) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری ...</Typography>;
  }

  return <MobileCalendar list={list} year={year} />;
};

// Next.js requires Suspense for useSearchParams in static exports
export default function CalendarPage() {
  return (
    <Suspense fallback={<Typography m={5} textAlign={"center"}>در حال بارگذاری ...</Typography>}>
      <CalendarContent />
    </Suspense>
  );
}