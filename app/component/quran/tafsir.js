"use client";

import React from "react";
import _ from "lodash";
import { useLocale, useTranslations } from "next-intl";
import { Box } from "@mui/material";
import { useQuranFontSizeStore } from "@/store/layout/useQuranFontSizeStore";
import { useTranslateFontSizeStore } from "@/store/layout/useTranslateFontSizeStore";
import { TafsirVerseText } from "./tafsirVerse";

export const TafsirList = ({ data, seriesId, verseId, rId }) => {
  const locale = useLocale();
  const t = useTranslations("Common");

  const quranFontSize = useQuranFontSizeStore((state) => state.quranFontSize);
  const translateFontSize = useTranslateFontSizeStore(
    (state) => state.translateFontSize
  );

  const verseRef = React.useRef(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (verseRef.current) {
        const elementTop = verseRef.current.getBoundingClientRect().top;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const offset = 400;

        window.scrollTo({
          top: elementTop + scrollTop - offset,
          behavior: "smooth",
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [verseId]);

  return (
    <>
      <Box sx={{ px: 2, pb: 22, pt: 2 }}>
        {_.map(
          _.filter(
            _.orderBy(data, (v) => v.verseId),
            (v) => !!v.translate?.fa
          ),
          (item, index) => {
            const isSelected = +verseId === +item?.verseId;
            return (
              <div
                key={index}
                ref={isSelected ? verseRef : null}
                //  style={isSelected ? { scrollMarginBottom: 120 } : {}}
              >
                <TafsirVerseText
                  item={item}
                  locale={locale}
                  seriesId={seriesId}
                  quranFontSize={quranFontSize}
                  translateFontSize={translateFontSize}
                  selected={isSelected}
                  rId={rId}
                />
              </div>
            );
          }
        )}
      </Box>
    </>
  );
};
