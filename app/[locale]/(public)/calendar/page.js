import { DesktopCalendar } from "@/app/fragment/calendar/desktopCalendar";
import { MobileCalendar } from "@/app/fragment/calendar/mobileCalendar";
import { getViewport } from "@/app/libs/isMobileDetect";
import { API } from "@/core/config/api";
import React from "react";

const CalendarPage = async () => {
  const viewport = await getViewport();

  const contentReq = await fetch(`${API().core}content/lecture/1404/year`);
  const list = await contentReq.json();

  return (
    <>
      {viewport === "desktop" && <DesktopCalendar list={list} year="1404" />}
      {viewport === "mobile" && <MobileCalendar list={list} year="1404" />}
    </>
  );
};

export default CalendarPage;
