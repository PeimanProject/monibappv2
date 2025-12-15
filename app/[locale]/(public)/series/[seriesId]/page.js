import { getViewport } from "@/app/libs/isMobileDetect";
import { GetOs } from "@/app/libs/getOs";
import { DesktopSeries } from "@/app/pages/series/desktopSeries";
import { MobileSeries } from "@/app/pages/series/mobileSeries";
import { API } from "@/core/config/api";
import { appConfig } from "@/core/config/values";
import React from "react";

export async function generateMetadata({ params }) {
  const { seriesId } = await params;
  const seriesReq = await fetch(`${API().core}content/series/${seriesId}`);
  const series = await seriesReq.json();
  const os = await GetOs();

  const title = `${series.title} | ${appConfig.title}`;

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

const SeriesPage = async ({ params, searchParams }) => {
  const { seriesId } = await params;
  let type = (await searchParams)?.type || "default";
  const viewport = await getViewport();

  type = type === "undefined" ? "lecture" : type;

  const seriesReq = await fetch(`${API().core}content/series/${seriesId}`);
  const series = await seriesReq.json();

  let quranData = null;
 
  if (series?.mainId === 1) {
    const data = await fetch(
      `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${
        series.rId * -1
      }&less=true`
    );
    quranData = await data.json();
  }

  const os = await GetOs();

  return (
    <>
      {viewport === "desktop" && (
        <DesktopSeries {...{ quranData, series, seriesId, type, os }} />
      )}
      {viewport === "mobile" && (
        <MobileSeries {...{ quranData, series, seriesId, type, os }} />
      )}
    </>
  );
};

export default SeriesPage;
