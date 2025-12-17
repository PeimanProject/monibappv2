"use client";
import PageMobileMiskat from "@/app/pages/miskat/pageMobileMiskat";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";
import { use, useEffect, useState } from "react";

export default function Page({ params }) {
  const { id, page_id } = use(params);

  const [content, setContent] = useState(null)

  const handleContentReq = async () => {
    const contentReq = await fetch(`${API().core}/miskat`, {
      method: "POST",
      body: JSON.stringify({ id: id, page_id: page_id, page: true }),
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
  return (
    <>
      <PageMobileMiskat content={content} viewport={"mobile"} page_id={page_id} id={id} />
    </>
  );
}
