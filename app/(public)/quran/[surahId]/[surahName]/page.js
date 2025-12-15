import { getViewport } from "@/app/libs/isMobileDetect";
import { QuranText } from "@/app/pages/series/quranText";
import React from "react";

// export async function generateMetadata({ params }) {
//   const { seriesId } = await params;
//   const seriesReq = await fetch(`${API().core}content/series/${seriesId}`);
//   const series = await seriesReq.json();

//   const title = `${series.title} | ${appConfig.title}`;

//   return {
//     title,
//     openGraph: {
//       title,
//       images: "/poster.jpg",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title,
//       description: appConfig.description,
//       siteId: "",
//       creator: "Monib",
//       creatorId: "",
//       images: ["https://monib.ai/poster.jpg"],
//     },
//   };
// }

const QuranPage = async ({ params, searchParams }) => {
  const { surahId } = await params;
  //   let type = (await searchParams)?.type || "default";
  const viewport = await getViewport();

  //   type = type === "undefined" ? "lecture" : type;

  //   const seriesReq = await fetch(`${API().core}content/series/${seriesId}`);
  //   const series = await seriesReq.json();

  let quranData = null;

  const data = await fetch(
    `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${
      surahId * -1
    }&less=true`
  );
  quranData = await data.json();

  const data2 = await fetch(
    `https://api.monibapp.ir/v3/service/quran?id=${surahId}`
  );
  const surahName2 = (await data2.json())?.surah;

  return (
    <>
      <QuranText {...{ quranData, surahId, surahName: surahName2 }} />
    </>
  );
};

export default QuranPage;
