"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Typography } from "@mui/material"
import { API } from "@/core/config/api";
import MobileMiskat from "@/app/pages/miskat/mobileMiskat";
function MiskatContent() {
    const searchParams = useSearchParams();
    const surah = searchParams.get("surah");
    const verseId = searchParams.get("verseId");
    const [content, setContent] = useState(null);

    useEffect(() => {
        if (surah && verseId) {
            handleContentReq(surah, verseId);
        }
    }, [surah, verseId]);

    const handleContentReq = async (s: string, v: string) => {
        const contentReq = await fetch(`${API().core}/miskat`, {
            method: "POST",
            body: JSON.stringify({ surah_id: s, verse_id: v }),
            headers: { "content-Type": "application/json" },
        });
        const data = await contentReq.json();
        setContent(data);
    };

    if (!content) return <Typography>در حال بارگذاری...</Typography>;
    return <MobileMiskat content={content} viewport={"mobile"} />;
}

export default function Page() {
    return (
        <Suspense fallback={<Typography>در حال بارگذاری...</Typography>}>
            <MiskatContent />
        </Suspense>
    );
}