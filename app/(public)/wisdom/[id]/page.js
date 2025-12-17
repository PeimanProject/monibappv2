"use client";
import React, { use, useEffect, useState } from "react";
import { MobileWisdom } from "@/app/pages/wisdom/mobileWisdom";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";

const WisdomPage = ({ params }) => {
  const { id } = use(params)
  const viewport = "mobile";
  const [list, setList] = useState(null)
  const [wisdom, setWisdom] = useState(null)

  const handleListReq = async () => {
    const listReq = await fetch(`${API().core}wisdom?page=0&size=100`);
    const data = await listReq.json();
    setList(data)
  }

  const handleGetSingeWisdom = async () => {
    const req = await fetch(`${API().core}wisdom/${id}`);
    const data = await req.json();
    setWisdom(data)
  }

  useEffect(() => {
    handleListReq()
    if (id) {
      handleGetSingeWisdom()
    }
  }, [])

  if (!list || !wisdom) {
    return <Typography m={5} textAlign={"center"}>
      در حال بارگذاری ...
    </Typography>
  }

  return (
    <>
      {viewport === "mobile" && <MobileWisdom SSRList={list} wisdom={wisdom} />}
    </>
  );
};

export default WisdomPage;
