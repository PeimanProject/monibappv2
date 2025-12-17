import { GetOs } from "@/app/libs/getOs";
import { MobilePlayer } from "@/app/pages/player/mobilePlayer";
import { API } from "@/core/config/api";
import React from "react";

const PlayerPage = async ({ params, searchParams }) => {
  const { lectureId } = await params;
  const mediaCurrent = (await searchParams)?.media || null; // Extract 'media' query parameter
  const time = (await searchParams)?.time || null; // Extract 'media' query parameter



  const req = await fetch(`${API().core}content/lecture/${lectureId}`);
  const lecture = await req.json();

  let quranData = null;
  if (lecture?.mainId === 1) {
    const data = await fetch(
      `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${lecture.contextId * -1
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

  const os = GetOs();

  return (
    <MobilePlayer
      {...{ srtArr, quranData, lecture, srtEnArr, os, mediaCurrent, time }}
    />
  )
};

export default PlayerPage;
