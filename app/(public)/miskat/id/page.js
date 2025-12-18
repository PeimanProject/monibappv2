"use client";
import PageMobileMiskat from "@/app/pages/miskat/pageMobileMiskat";
import { API } from "@/core/config/api";
import { Typography } from "@mui/material";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// 1. Move the logic into a child component
function MiskatIDContent() {
  const searchParams = useSearchParams();

  // Read from URL: ?id=xxx&page_id=yyy
  const id = searchParams.get("id");
  const page_id = searchParams.get("page_id");

  const [content, setContent] = useState(null);

  useEffect(() => {
    const handleContentReq = async () => {
      // Only fetch if parameters exist
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
        console.error("Fetch failed:", error);
      }
    };

    handleContentReq();
  }, [id, page_id]); // Re-fetch if params change

  if (!id || !page_id) {
    return <Typography m={5} textAlign={"center"}>خطا: شناسه یافت نشد</Typography>;
  }

  if (!content) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>;
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