"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { DesktopLectureList } from "./desktopLectureList";
import { MobileTitle } from "../mobileTitle";
import { TextList } from "@/app/component/quran/textList";
import { useVerseDataStore } from "@/store/useVerseData";
import { QuranTitle } from "../wisdom/quranTitle";
import { TafsirList } from "@/app/component/quran/tafsir";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";

export const MobileSeries = ({
  series,
  quranData,
  seriesId,
  type = "lecture",
  os
}) => {
  const locale = useLocale();
  const { setVerse } = useVerseDataStore();
  const [value, setValue] = React.useState(type || "lecture");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = React.useCallback(
    (newValue) => () => {
      setValue(newValue);

      const params = new URLSearchParams(searchParams.toString());
      params.set("type", newValue);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  React.useEffect(
    () =>
      setVerse(
        `${series?.title} ${series?.description}`,
        null,
        series.mainId === 1 ? "quran" : null
      ),
    [series?.title]
  );
  

  return (
    <>
      {series.mainId === 1 ? (
        <QuranTitle value={value} onChange={handleChange} rId={series.rId} />
      ) : (
        <MobileTitle
          {...series}
          lectureCount={series?.lectureList?.length}
          value={value}
          onChange={handleChange}
        />
      )}
      {series.mainId === 1 &&
        (series.lastCourseId || series.newCourseId) &&
        ((value || "lecture" || "default") === "lecture" ||
          (value || "lecture" || "default") === "default") && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              mt: 1,
              px: 1,
            }}
          >
            <Link
              href={`/${locale}/series/${
                series.lastCourseId || series.newCourseId
              }?type=${type}`}
            >
              <Button variant="contained" color="primary" size="small">
                {series.lastCourseId ? "دور پیشین" : "دور جدید"}
              </Button>
            </Link>
          </Box>
        )}
      {(value === "lecture" || value === "default") && (
        <Container sx={{ pt: 1, pb: 22 }}>
          <DesktopLectureList {...series} os={os} />
        </Container>
      )}
      {value === "quran" && (
        <TextList
          seriesId={seriesId}
          {...series}
          data={quranData}
          rId={series.rId}
        />
      )}
      {value === "miskat" && series.rId < 17 && (
        <TafsirList
          seriesId={seriesId}
          {...series}
          data={quranData}
          rId={series.rId}
        />
      )}
    </>
  );
};
