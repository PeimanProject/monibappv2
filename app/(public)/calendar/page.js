"use client";
import { MobileCalendar } from "@/app/fragment/calendar/mobileCalendar";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const CalendarPage = () => {
  const [list, setList] = useState(null)

  const handleListReq = async () => {

    const contentReq = await fetch(`${API().core}content/lecture/1404/year`);
    const data = await contentReq.json();
    setList(data)
  }

  useEffect(() => {
    handleListReq()
  }, [])

  if (!list) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری ...</Typography>
  }
  return <MobileCalendar list={list} year="1404" />
};

export default CalendarPage;
