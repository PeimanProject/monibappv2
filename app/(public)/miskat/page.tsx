"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material"
import { API } from "@/core/config/api";
import MobileMiskat from "@/app/pages/miskat/mobileMiskat";
function MiskatContent() {
    const searchParams = useSearchParams();
    const surah = searchParams.get("surah");
    const verseId = searchParams.get("verseId");
    const [content, setContent] = useState(undefined);

    useEffect(() => {
        if (surah && verseId) {
            handleContentReq(surah, verseId);
        }
    }, [surah, verseId]);

    const handleContentReq = async (s: string, v: string) => {
        try {
            const contentReq = await fetch(`${API().core}/miskat`, {
                method: "POST",
                body: JSON.stringify({ surah_id: s, verse_id: v }),
                headers: { "content-Type": "application/json" },
            });
            const data = await contentReq.json();
            setContent(data);
        } catch (e) {
            setContent(null)
        }
    };
    if (content === undefined) return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>;
    if (content === null) return <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 2,
    }}>
        <Typography>خطایی رخ داده است</Typography>
        <Typography>لطفا اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید</Typography>
        <Button onClick={() => { handleContentReq(surah, verseId) }} variant="contained">تلاش دوباره</Button>
    </Box>
    return <MobileMiskat content={content} viewport={"mobile"} />;
}

export default function Page() {
    return (
        <Suspense fallback={<Typography m={5} textAlign={"center"} >در حال بارگذاری...</Typography>}>
            <MiskatContent />
        </Suspense>
    );
}