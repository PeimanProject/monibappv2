"use client";
import PageMobileMiskat from "@/app/pages/miskat/pageMobileMiskat";
import { API } from "@/core/config/api";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// 1. Move the logic into a child component
function MiskatIDContent() {
  const searchParams = useSearchParams();

  // Read from URL: ?id=xxx&page_id=yyy
  const id = searchParams.get("id");
  const page_id = searchParams.get("page_id");

  const [content, setContent] = useState(undefined);
  const handleContentReq = async () => {
    // Only fetch if parameters exist
    setContent(undefined)
    if (!id || !page_id) return;

    try {
      const contentReq = await fetch(`${API().core}/miskat`, {
        method: "POST",
        body: JSON.stringify({ id: id, page_id: page_id, page: true }),
        cache: "no-cache",
        headers: {
          "content-Type": "application/json",
        },
      });

      const data = await contentReq.json();
      setContent(data);
    } catch (error) {
      setContent(null)
      console.error("Fetch failed:", error);
    }
  };
  useEffect(() => {
    handleContentReq();
  }, [id, page_id]); // Re-fetch if params change

  if (!id || !page_id) {
    return <Typography m={5} textAlign={"center"}>خطا: شناسه یافت نشد</Typography>;
  }

  if (content === undefined) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>;
  }

  if (content === null) {
    return <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      gap: 2,
    }}>
      <Typography>خطایی رخ داده است</Typography>
      <Typography>لطفا اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید</Typography>
      <Button onClick={() => { handleContentReq() }} variant="contained">تلاش دوباره</Button>
    </Box>
  }

  return <PageMobileMiskat content={content} viewport={"mobile"} page_id={page_id} id={id} />;
}

// 2. The main Page component wraps everything in Suspense
export default function Page() {
  return (
    <Suspense fallback={<Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>}>
      <MiskatIDContent />
    </Suspense>
  );
}