"use client";

import React from "react";
import _ from "lodash";

import { useLocale, useTranslations } from "next-intl";
import { Box } from "@mui/material";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useQuranFontSizeStore } from "@/store/layout/useQuranFontSizeStore";
import { useTranslateFontSizeStore } from "@/store/layout/useTranslateFontSizeStore";
import { useCurrentVerseStore } from "@/store/useQuranStore";
import { DesktopVerse } from "./desktopVerse";

export const DesktopTextList = ({
  data,
  seriesId,
  verseId,
  type,
  rId,
  surahId,
}) => {
  const locale = useLocale();
  const t = useTranslations("Common");

  const quranFontSize = useQuranFontSizeStore((state) => state.quranFontSize);
  const translateFontSize = useTranslateFontSizeStore(
    (state) => state.translateFontSize
  );

  const verse = useCurrentVerseStore((state) => state.verse);

  const verseRef = React.useRef(null);

  React.useEffect(() => {
    if (verseRef.current) {
      verseRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [verseId]);

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            bgcolor: "background.default",

            px: 1,
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            zIndex: 99,
            top: 80,
            position: "sticky",
            mb: 2,
          }}
        >
          <Box
            // onClick={handleVerse(true, "page")}
            color="inherit"
            sx={{ width: 100, color: "black" }}
          >
            {t("page")}
            {digitsEnToFa(verse?.pageNo || "-")}
          </Box>

          <Box sx={{ flex: 1 }} />
        </Box>
        <Box sx={{ px: 0.5, pb: 22, pt: 2 }}>
          {_.map(
            _.filter(
              _.orderBy(data, (v) => v.verseId),
              (v) => !!v.translate?.fa
            ),
            (item, index) => {
              const isSelected = +verseId === +item?.verseId;
              return (
                <div key={index} ref={isSelected ? verseRef : null}>
                  <DesktopVerse
                    item={item}
                    type={type}
                    locale={locale}
                    seriesId={seriesId}
                    quranFontSize={quranFontSize}
                    translateFontSize={translateFontSize}
                    selected={isSelected}
                    rId={rId}
                    surahId={surahId}
                  />
                </div>
              );
            }
          )}
        </Box>
      </Box>
    </>
  );
};
