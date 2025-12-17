"use client";
import React, { useEffect, useState } from "react";
import { MobileWisdom } from "@/app/pages/wisdom/mobileWisdom";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";

const WisdomPage = () => {
  const viewport = "mobile";
  const [list, setList] = useState(null)
  const handleListReq = async () => {
    const listReq = await fetch(`${API().core}wisdom?page=0&size=100`);
    const data = await listReq.json();
    setList(data)
  }
  useEffect(() => {
    handleListReq()
  }, [])

  if (!list) {
    return <Typography m={5} textAlign={"center"}>
      در حال بارگذاری ...
    </Typography>
  }
  return (
    <>
      {viewport === "mobile" && <MobileWisdom SSRList={list} />}
      {viewport === "desktop" && <MobileWisdom SSRList={list} desktop />}
    </>
  );
};

export default WisdomPage;
