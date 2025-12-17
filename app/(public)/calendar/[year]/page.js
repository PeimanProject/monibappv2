"use client";
import { MobileCalendar } from "@/app/fragment/calendar/mobileCalendar";
import { API } from "@/core/config/api";
import React, { use, useEffect } from "react";

const CalendarPage = ({ params }) => {
  const { year } = use(params);
  const [list, setList] = useState(null)

  const handleListReq = async () => {

    const contentReq = await fetch(`${API().core}content/lecture/${year}/year`);
    const data = await contentReq.json();
    setList(data)
  }
  useEffect(() => {
    handleListReq()
  }, [])
  if (!list) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری ...</Typography>
  }
  return <MobileCalendar list={list} year={year} />
};

export default CalendarPage;
