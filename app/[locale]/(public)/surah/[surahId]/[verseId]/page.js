import { getViewport } from "@/app/libs/isMobileDetect";
import { MobileVersePlayer } from "@/app/pages/player/mobileVersePlayer";
import { API } from "@/core/config/api";
import { appConfig } from "@/core/config/values";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import React from "react";

export async function generateMetadata({ params }) {
  const { verseId, surahId } = await params;
  const req = await fetch(
    `https://core.monibapp.com/app/v2/verse/series/${surahId}`
  );
  const sr = await req.json();

  const seriesReq = await fetch(`${API().core}content/series/${sr?.series_id}`);
  const series = await seriesReq.json();

  const title = `${series.title}, تفسبر آیه ${digitsEnToFa(verseId)} | ${
    appConfig.title
  }`;

  return {
    title,
    openGraph: {
      title,
      images: "/poster.jpg",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: appConfig.description,
      siteId: "",
      creator: "Monib",
      creatorId: "",
      images: ["https://monib.ai/poster.jpg"],
    },
  };
}

const VersePlayer = async ({ params }) => {
  const viewport = await getViewport();
  const { verseId, surahId } = await params;

  const req = await fetch(
    `https://core.monibapp.com/app/v2/verse/series/${surahId}`
  );
  const sr = await req.json();

  const seriesReq = await fetch(`${API().core}content/series/${sr?.series_id}`);
  const series = await seriesReq.json();

  let quranData = null;

  if (series?.mainId === 1) {
    const data = await fetch(
      `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${surahId * -1}`
    );
    quranData = await data.json();
  }

  const verseReq = await fetch(
    `${API().core}verse/${sr?.series_id}/${verseId}`
  );
  const verse = await verseReq.json();

  return (
    <>
      {(viewport === "mobile" || viewport === "desktop") && (
        <MobileVersePlayer
          desktop={viewport === "desktop"}
          {...{ quranData, series, seriesId: sr?.series_id, verseId, verse }}
        />
      )}
    </>
  );
};

export default VersePlayer;
