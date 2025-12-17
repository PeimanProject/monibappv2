"use client";
import { MobileLastLecture } from "@/app/pages/last/mobileLastLecture";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const LastLecturePage = () => {

  const [list, setList] = useState(null)

  const handleListReq = async () => {

    const listReq = await fetch(`${API().core}lastLecture/?size=100`);
    const data = await listReq.json();

    setList(data)
  }

  useEffect(() => {
    handleListReq()
  }, [])

  if (!list) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری ...</Typography>
  }
  return <MobileLastLecture list={list} />
};

export default LastLecturePage;