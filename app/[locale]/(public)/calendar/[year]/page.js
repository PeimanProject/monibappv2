import { DesktopCalendar } from "@/app/fragment/calendar/desktopCalendar";
import { MobileCalendar } from "@/app/fragment/calendar/mobileCalendar";
import { getViewport } from "@/app/libs/isMobileDetect";
import { API } from "@/core/config/api";
import React from "react";

const CalendarPage = async ({ params }) => {
  const { year } = await params;
  const viewport = await getViewport();

  const contentReq = await fetch(`${API().core}content/lecture/${year}/year`);
  const list = await contentReq.json();

  return (
    <>
      {viewport === "desktop" && <DesktopCalendar list={list} year={year} />}
      {viewport === "mobile" && <MobileCalendar list={list} year={year} />}
    </>
  );
};

export default CalendarPage;
