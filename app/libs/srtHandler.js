"use client";

import { useEffect, useState } from "react";
import { SrtReq } from "../data/srt/vtt/[lectureId]/route";

export function useVttTrack({ lectureId, filename }) {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        const load = async () => {
            if (!lectureId || !filename) return;

            let objectUrl;

            SrtReq({ lectureId, filename }).then((vtt) => {
                const blob = new Blob([vtt], { type: "text/vtt" });
                objectUrl = URL.createObjectURL(blob);
                setUrl(objectUrl);
            });

            return () => {
                if (objectUrl) URL.revokeObjectURL(objectUrl);
            };
        }
        load()

    }, [lectureId, filename]);

    return url;
}
