"use client";
import { API } from "@/core/config/api";
import MobileMiskat from "@/app/pages/miskat/mobileMiskat";
import { use, useEffect, useState } from "react";
import { Typography } from "@mui/material";

export default function Page({ params }) {
  const { surah, verseId } = use(params);
  const [content, setContent] = useState()

  const handleContentReq = async () => {
    const contentReq = await fetch(`${API().core}/miskat`, {
      method: "POST",
      body: JSON.stringify({ surah_id: surah, verse_id: verseId }),
      cache: "no-cache",
      headers: {
        "content-Type": "application/json",
      },
    });

    const data = await contentReq.json();
    setContent(data)
  }
  useEffect(() => {
    handleContentReq()
  }, [])

  if (!content) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>
  }

  return <MobileMiskat content={content} viewport={"mobile"} />;
}
