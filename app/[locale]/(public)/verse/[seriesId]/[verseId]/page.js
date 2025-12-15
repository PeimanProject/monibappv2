import { getViewport } from "@/app/libs/isMobileDetect";
import { DesktopVersePlayer } from "@/app/pages/player/desktopVersePlayer";
import { MobileVersePlayer } from "@/app/pages/player/mobileVersePlayer";
import { API } from "@/core/config/api";
import { appConfig } from "@/core/config/values";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import React from "react";

export async function generateMetadata({ params }) {
  const { verseId, seriesId } = await params;
  const seriesReq = await fetch(`${API().core}content/series/${seriesId}`);
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
  const { verseId, seriesId } = await params;

  const seriesReq = await fetch(`${API().core}content/series/${seriesId}`);
  const series = await seriesReq.json();

  let quranData = null;

  if (series?.mainId === 1) {
    const data = await fetch(
      `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${
        series.rId * -1
      }`
    );
    quranData = await data.json();
  }

  const verseReq = await fetch(`${API().core}verse/${seriesId}/${verseId}`);
  const verse = await verseReq.json();

  return (
    <>
      {viewport === "desktop" && (
        <DesktopVersePlayer
          {...{ quranData, series, seriesId, verseId, verse }}
        />
      )}
      {viewport === "mobile" && (
        <MobileVersePlayer
          {...{ quranData, series, seriesId, verseId, verse }}
        />
      )}
    </>
  );
};

export default VersePlayer;
