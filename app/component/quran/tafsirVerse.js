"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useInView } from "@react-spring/web";
import { useCurrentVerseStore } from "@/store/useQuranStore";
import Link from "next/link";

export const TafsirVerseText = ({ locale, item, rId }) => {
  const [ref, inView] = useInView();
  const setVerse = useCurrentVerseStore((state) => state.setVerse);

  React.useEffect(() => {
    if (!!inView) {
      setVerse(item);
    }
  }, [inView, item, setVerse]);

  if (!item) return null;

  const VerseContent = (
    <Box ref={ref} sx={{ display: "flex", justifyContent: "flex-start" }}>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-start",
          color: "text.primary",
          height: 70,
          borderBottom: (theme) =>
            `1px solid ${theme.palette.primary.main}`,
        }}
      >
        {item.verseId !== 0 && (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 1,
              px: 1,
              ...(locale === "fa" && {
                "&:after": {
                  fontFamily: "var(--arabic-font)",
                  content: '"﴾"',
                  position: "absolute",
                  right: -3,
                  top: 0,
                },
                "&:before": {
                  fontFamily: "var(--arabic-font)",
                  content: '"﴿"',
                  position: "absolute",
                  left: -3,
                  top: 0,
                },
              }),
              ...(locale === "en" && {
                "&:after": {
                  fontFamily: "var(--arabic-font)",
                  content: '"﴾"',
                  position: "absolute",
                  left: -3,
                  top: 0,
                },
                "&:before": {
                  fontFamily: "var(--arabic-font)",
                  content: '"﴿"',
                  position: "absolute",
                  right: -3,
                  top: 0,
                },
              }),
            }}
          >
            <Typography>
              {locale === "en"
                ? item?.verseId
                : digitsEnToFa(item?.verseId)}
            </Typography>
          </Box>
        )}

        <Typography
          component="h2"
          variant="body1"
          sx={{
            fontFamily: "var(--arabic-font)",
            fontSize: "1.8rem",
            fontWeight: "light",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "normal",
            lineHeight: 1.5,
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            width: 1 / 1,
          }}
        >
          {item.arabicText}
        </Typography>
      </Box>
    </Box>
  );

  return item.verseId !== 0 ? (
    <Link
      href={`/${locale}/miskat/${rId}/${item.verseId}`}
      style={{ textDecoration: "none" }}
    >
      {VerseContent}
    </Link>
  ) : (
    VerseContent
  );
};
