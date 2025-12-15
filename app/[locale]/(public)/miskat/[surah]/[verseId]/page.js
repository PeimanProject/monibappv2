import { API } from "@/core/config/api";
import MobileMiskat from "@/app/pages/miskat/mobileMiskat";
import { getViewport } from "@/app/libs/isMobileDetect";

export default async function Page({ params }) {
  const { surah, verseId } = await params;


  const contentReq = await fetch(`${API().core}/miskat`, {
    method: "POST",
    body: JSON.stringify({ surah_id: surah, verse_id: verseId }),
    cache: "no-cache",
    headers: {
      "content-Type": "application/json",
    },
  });

  const content = await contentReq.json();

  const viewport = await getViewport();

  return <MobileMiskat content={content} viewport={viewport} />;
}
