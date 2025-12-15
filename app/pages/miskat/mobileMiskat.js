"use client";

import { useNavBarStore } from "@/store/layout/useNavBarStore";
import { desktopValues } from "@/core/config/values";
import { Container, Box, Typography, Divider, alpha } from "@mui/material";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import React, { useEffect } from "react";

const splitFootnotes = (footnoteText) => {
  if (!footnoteText) return [];

  return footnoteText
    .split("\n")
    .map((line) => line.replace(/^\s*\.\s*/, "").trim())
    .filter(Boolean);
};

export const cleanText = (text) => {
  if (!text) return "";

  return digitsEnToFa(
    text
      .replace(
        /([^\s\d\u06F0-\u06F9\(\)\[\]«»A-Za-z])[\d\u06F0-\u06F9]+/g,
        " $1"
      )
      .replace(/([A-Za-z])[\d\u06F0-\u06F9]+/g, "$1")
  );
};

const isArabicBlock = (text, threshold) => {
  if (!text) return false;

  const letters = text.match(/[a-zA-Z\u0600-\u06FF]/g) || [];

  if (letters.length === 0) return false;

  const arabicLetters = text.match(/[\u0621-\u063A\u0641-\u064A]/g) || [];

  const ratio = arabicLetters.length / letters.length;

  return ratio >= threshold;
};

const wrapArabicBlocks = (text, threshold = 2) => {
  if (!text) return "";

  const blocks = text.split(/(\s+|\(|\)|\[|\]|،|\.|:|;|!|\?)/g);

  const processed = blocks.map((block) => {
    if (isArabicBlock(block, threshold)) {
      return `<span class="arabic-text">${block}</span>`;
    }
    return block;
  });

  return processed.join("");
};

const formatFootnotesWithTitles = (text, footnotesArray) => {
  if (!text) return "";

  return text.replace(/\(([\d\u06F0-\u06F9]{1,3})\)/g, (match, rawNum) => {
    const num = parseInt(
      rawNum.replace(/[\u06F0-\u06F9]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 1728)
      )
    );

    const title = footnotesArray[num - 1] || "";

    return `<sup class="footnote-ref" title="${title}">
      (${rawNum})
      </sup>`;
  });
};

const wrapArabicOnlyWithSpan = (text) => {
  if (!text) return "";

  return text
    .split(/(\s+)/)
    .map((word) => {
      return isProbablyArabic(word)
        ? `<span class="arabic-text">${word}</span>`
        : word;
    })
    .join("");
};

const cleanBookName = (name) => {
  if (!name) return "";

  const noPrefix = name.replace(/^\d+\s*-\s*/, "");

  return noPrefix.replace(/مشکات/g, "تفسیر مشکاة");
};

export default function MobileMiskat({ content, viewport }) {
  const { setNavBar } = useNavBarStore();
  useEffect(() => {
    setNavBar({
      links: [
        { title: "قرآن کریم", href: `content/quran?type=miskat` },

        {
          title: content.surah,
          href: `quran/${content.surah_id}/${content.surah}?type=miskat`,
        },
      ],
      title: `آیه ${digitsEnToFa(content.verse_id)}`,
    });
  }, [setNavBar, content]);

  return (
    <Container maxWidth="md">
      {viewport === "mobile" && (
        <Box
          sx={{
            position: "sticky",
            top: viewport === "desktop" ? 64 : desktopValues({}).APP_HEIGHT,
            zIndex: 99,
            height: 50,

            bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
            backdropFilter: "blur(10px)",
            // borderBottom: 1,
            // borderColor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            px: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "400" }}>
            {content.title}
          </Typography>
          <Typography variant="h6" sx={{ mx: 1, fontWeight: "300" }}>
            /
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "400" }}>
            {content.surah}
          </Typography>
          <Typography variant="h6" sx={{ mx: 1, fontWeight: "300" }}>
            /
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "400" }}>
            {"آیه"} {digitsEnToFa(content.verse_id)}
          </Typography>
        </Box>
      )}
      <Container maxWidth="sm">
        <Box
          sx={{ px: 3, pt: 2, pb: 8, textAlign: "justify", fontWeight: "400" }}
        >
          {content?.content?.map((ct, index) => (
            <Box key={index} sx={{ mb: 5 }}>
              <Divider
                sx={{
                  borderColor: "primary.main",
                  color: "primary.dark",
                  "&:after": { borderTopColor: "primary.main" },
                  "&:before": { borderTopColor: "primary.main" },
                }}
              >
                <Typography variant="caption" sx={{ mb: 1 }}>
                  {cleanBookName(ct.book_name)} - صفحه{" "}
                  {digitsEnToFa(ct.page_id)}
                </Typography>
              </Divider>
              {ct.texts
                ?.filter(
                  (textItem) =>
                    Array.isArray(textItem.children) &&
                    textItem.children.some((child) => child.text?.trim() !== "")
                )
                .map((textItem, i) => (
                  <Box
                    key={i}
                    sx={{
                      ".footnote-ref": {
                        fontSize: "0.8em",
                        verticalAlign: "super",
                        color: "green",
                        cursor: "pointer",
                      },
                      a: {
                        color: "green",
                        textDecoration: "none",
                      },

                      // ...(index === 0 &&
                      //   i === 0 && {
                      //     fontFamily: "var(--arabic-font)",
                      //     fontSize: "2.2rem",
                      //   }),

                      ".arabic-text": {
                        textAlign: "right",
                        fontFamily: "var(--arabic-font)",
                        fontSize: "1.2em",
                        color: "primary.main",
                        display: "inline",
                      },
                    }}
                  >
                    {textItem.children
                      .filter((child) => child.text?.trim() !== "")
                      .map((val, ix) => (
                        <Box
                          component="p"
                          key={ix}
                          dangerouslySetInnerHTML={{
                            __html: formatFootnotesWithTitles(
                              cleanText(val.text),
                              splitFootnotes(ct.footnote)
                            ),
                          }}
                        />
                      ))}
                  </Box>
                ))}
              {ct.footnote?.trim() && (
                <Box sx={{ mt: 1, px: 1, borderLeft: "2px solid #ccc" }}>
                  {ct.footnote.split("\n").map((line, i) => (
                    <Box
                      key={i}
                      id={`footnote-${i + 1}`}
                      data-ref={`ref-${i + 1}`}
                      sx={{ display: "flex", alignItems: "flex-start" }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ minWidth: 20 }}
                      >
                        {digitsEnToFa(i + 1)}.
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {line}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Container>
  );
}
