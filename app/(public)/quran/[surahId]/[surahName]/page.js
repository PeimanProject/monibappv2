"use client"
import { QuranText } from "@/app/pages/series/quranText";
import { Typography } from "@mui/material";
import React, { use, useEffect, useState } from "react";


const QuranPage = ({ params }) => {
  const { surahId } = use(params);

  const [quranData, setQuranData] = useState(null)
  const [surahName, setSurahName] = useState(null)


  const handleQuranData = async () => {
    const data = await fetch(
      `https://api.monibapp.ir/v3/service/quran/pages/?surahId=${surahId * -1
      }&less=true`
    );
    const res = await data.json();
    setQuranData(res)
  }

  const handleSurahName = async () => {
    const res = await fetch(
      `https://api.monibapp.ir/v3/service/quran?id=${surahId}`
    );
    const data = (await res.json())?.surah;
    setSurahName(data)
  }
  useEffect(() => {
    handleQuranData()
    handleSurahName()
  }, [])
  if (!quranData || !surahName) {
    return <Typography m={5} textAlign={"center"}>در حال بارگذاری...</Typography>
  }
  return (
    <>
      <QuranText {...{ quranData, surahId, surahName }} />
    </>
  );
};

export default QuranPage;
