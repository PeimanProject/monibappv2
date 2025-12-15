"use client";

import React from "react";
import _ from "lodash";
import { Verse } from "./verse";
import { Box } from "@mui/material";
import { useQuranFontSizeStore } from "@/store/layout/useQuranFontSizeStore";
import { useTranslateFontSizeStore } from "@/store/layout/useTranslateFontSizeStore";

export const TextList = ({ data, seriesId, verseId, rId }) => {

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
      <Box>
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "primary.dark",
            py: 0.5,
            px: 2,
            position: "sticky",
            zIndex: 99,
            top: desktopValues({}).APP_HEIGHT + desktopValues({}).TITLE_HEIGHT,
          }}
        >
          <Button
            // onClick={handleVerse(true, "page")}
            color="inherit"
            sx={{ width: 100, color: "black" }}
          >
            {t("page")}
            {digitsEnToFa(verse?.pageNo || "-")}
          </Button>

          <Box sx={{ flex: 1 }} />
        </Box> */}
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
                  <Verse
                    item={item}
                    locale={"fa"}
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
      </Box>
    </>
  );
};
