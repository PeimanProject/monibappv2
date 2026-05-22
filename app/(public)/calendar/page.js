"use client";
import { MobileCalendar } from "@/app/fragment/calendar/mobileCalendar";
import { API } from "@/core/config/api";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function isValidCalendarPayload(data) {
  return (
    data &&
    typeof data === "object" &&
    data.hijri &&
    typeof data.hijri === "object" &&
    Array.isArray(data.hijri_month) &&
    data.hijri_month.length > 0
  );
}

const CalendarContent = () => {
  const searchParams = useSearchParams();
  const year = searchParams.get("year") || "1405";
  const [list, setList] = useState(undefined);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const handleListReq = async () => {
      setList(undefined);
      setLoadError(false);
      try {
        const contentReq = await fetch(
          `${API().core}content/lecture/${year}/year`
        );
        if (!contentReq.ok) {
          setLoadError(true);
          setList(null);
          return;
        }
        const data = await contentReq.json();
        if (!isValidCalendarPayload(data)) {
          setLoadError(true);
          setList(null);
          return;
        }
        setList(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoadError(true);
        setList(null);
      }
    };
    handleListReq();
  }, [year]);

  if (list === undefined) {
    return (
      <Typography m={5} textAlign="center">
        در حال بارگذاری ...
      </Typography>
    );
  }

  if (loadError || list === null) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          p: 3,
          minHeight: "40vh",
        }}
      >
        <Typography textAlign="center">
          داده تقویم سال {year} در دسترس نیست.
        </Typography>
        <Typography textAlign="center" variant="caption" color="text.secondary">
          لطفاً اتصال اینترنت را بررسی کنید یا سال دیگری را انتخاب کنید.
        </Typography>
        <Button component={Link} href="/calendar?year=1404" variant="contained">
          مشاهده تقویم ۱۴۰۴
        </Button>
      </Box>
    );
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