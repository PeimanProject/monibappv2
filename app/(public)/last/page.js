"use client";
import { MobileLastLecture } from "@/app/pages/last/mobileLastLecture";
import { API } from "@/core/config/api";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const LastLecturePage = () => {

  const [list, setList] = useState(undefined)

  const handleListReq = async () => {
    try {
      const listReq = await fetch(`${API().core}lastLecture/?size=100`);
      const data = await listReq.json();
      setList(data)
    } catch (e) {
      setList(null)
    }

  }

  useEffect(() => {
    handleListReq()
  }, [])

  if (list === undefined) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری ...</Typography>
  }

  if (list === null) {
    return (<Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      gap: 2,
    }}>
      <Typography>خطایی رخ داده است</Typography>
      <Typography>لطفا اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید</Typography>
      <Button onClick={handleListReq} variant="contained">تلاش دوباره</Button>
    </Box>)
  }

  return <MobileLastLecture list={list} />
};

export default LastLecturePage;