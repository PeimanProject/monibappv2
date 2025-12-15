import { GetOs } from "@/app/libs/getOs";
import { getViewport } from "@/app/libs/isMobileDetect";
import { DesktopPlayer } from "@/app/pages/player/desktopPlayer";
import { MobilePlayer } from "@/app/pages/player/mobilePlayer";
import { API } from "@/core/config/api";
import { appConfig } from "@/core/config/values";
import { numberToWords } from "@persian-tools/persian-tools";
import React from "react";

export async function generateMetadata({ params }) {
  const { lectureId } = await params;

  const req = await fetch(`${API().core}content/lecture/${lectureId}`);
  const lecture = await req.json();

  const title = `${lecture.contextName} جلسه  ${numberToWords(
    lecture.rowNumber,
    { ordinal: true }
  )} | ${appConfig.title}`;

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

const PlayerPage = async ({ params, searchParams }) => {
  const { lectureId } = await params;
  const mediaCurrent = (await searchParams)?.media || null; // Extract 'media' query parameter
  const time = (await searchParams)?.time || null; // Extract 'media' query parameter

  const viewport = await getViewport();
 

  const req = await fetch(`${API().core}content/lecture/${lectureId}`);
  const lecture = await req.json();

  let quranData = null;
  if (lecture?.mainId === 1) {
    const data = await fetch(
      `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${
        lecture.contextId * -1
      }&less=true`
    );
    quranData = await data.json();
  }

  let srtArr = null;
  if (!!lecture?.srt?.serverSrc) {
    const listJson = await fetch(
      `https://bundles.monibapp.ir/srt_json/${lectureId}/?filename=${lecture?.srt?.fileName}`
    );
    srtArr = await listJson.json();
  }

  let srtEnArr = null;
  if (!!lecture?.srt_en?.serverSrc) {
    const listJson = await fetch(
      `https://bundles.monibapp.ir/srt_json/${lectureId}/?filename=${lecture?.srt_en?.fileName}`
    );
    srtEnArr = await listJson.json();
  }

  const os = await GetOs();
  
  return (
    <>
      {viewport === "desktop" && (
        <DesktopPlayer
          {...{ srtArr, quranData, lecture, srtEnArr, mediaCurrent, os, time }}
        />
      )}
      {viewport === "mobile" && (
        <MobilePlayer
          {...{ srtArr, quranData, lecture, srtEnArr, os, mediaCurrent, time }}
        />
      )}
    </>
  );
};

export default PlayerPage;
