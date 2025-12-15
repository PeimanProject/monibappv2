"use client";

import React from "react";
import {
  Box,
  Typography,
  ButtonBase,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import _ from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "@react-spring/web";
import { useCurrentVerseStore } from "@/store/useQuranStore";

const VerseNumber = ({ verseId, locale }) => (
  <Box
    sx={{
      position: "relative",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      flexBasis: 42,
      pt: 0.2,
      mt: -0.2,
    }}
  >
    <Typography
      component="div"
      sx={{
        position: "relative",
        // ...(locale === "fa" && {
        //   "&:after": {
        //     fontFamily: "var(--arabic-font)",
        //     content: '"﴿"',
        //     position: "absolute",
        //     right: 10,
        //     top: 0,
        //   },
        //   "&:before": {
        //     fontFamily: "var(--arabic-font)",
        //     content: '"﴾"',
        //     position: "absolute",
        //     left: 10,
        //     top: 0,
        //   },
        // }),
        // ...(locale === "en" && {
        //   "&:after": {
        //     fontFamily: "var(--arabic-font)",
        //     content: '"﴾"',
        //     position: "absolute",
        //     left: -3,
        //     top: 0,
        //   },
        //   "&:before": {
        //     fontFamily: "var(--arabic-font)",
        //     content: '"﴿"',
        //     position: "absolute",
        //     right: -3,
        //     top: 0,
        //   },
        // }),
      }}
    >
      {locale === "en" ? verseId : digitsEnToFa(`${verseId}`)}
    </Typography>
  </Box>
);

const VerseText = ({
  locale,
  item,
  align = "center",
  translateFontSize = 50,
  quranFontSize = 50,
}) => {
  const [ref, inView] = useInView();
  const setVerse = useCurrentVerseStore((state) => state.setVerse);

  React.useEffect(() => {
    if (!!inView) {
      setVerse(item);
    }
  }, [inView, item, setVerse]);

  return (
    !!item && (
      <Box ref={ref} sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              ...(align === "center" && {
                justifyContent: "center",
              }),
              ...(align === "right" && {
                justifyContent: "flex-start",
              }),
              flexWrap: "wrap",
              ...(locale === "en" && {
                direction: "rtl",
              }),
              color: "text.primary",
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
            {_.map(_.split(item.arabicText, " "), (tx, index) => (
              <Typography
                key={`${item.verseId}-${index}`}
                component="h2"
                variant="h4"
                sx={{
                  fontFamily: "var(--arabic-font)",
                  ml: 1,
                  ...(quranFontSize === 0 && {
                    fontSize: "1.7rem",
                  }),
                  ...(quranFontSize === 50 && {
                    fontSize: "1.8rem",
                  }),
                  ...(quranFontSize === 100 && {
                    fontSize: "3.125rem",
                  }),
                  // ...(selected?.verseId === item?.verseId &&
                  //   selected?.surahId === item?.surahId && {
                  //     color: "#40ba8d",
                  //   }),
                }}
              >
                {tx}
              </Typography>
            ))}
          </Box>
          <Typography
            component="h2"
            variant="body1"
            key={item?.verseId}
            sx={{
              color: "inherit",
              mt: 0.2,
              lineHeight: 1.8,
              flex: 1,
              textAlign: "center",

              ...(translateFontSize === 0 && {
                fontSize: "0.8rem",
              }),
              ...(translateFontSize === 50 && {
                fontSize: "0.89rem",
              }),
              ...(translateFontSize === 100 && {
                fontSize: "1.4rem",
              }),
            }}
          >
            {item?.translate[locale]}
          </Typography>
        </Box>
      </Box>
    )
  );
};

export const Verse = ({
  item,
  formats = "list",
  locale,
  seriesId,
  selected,
  quranFontSize = 50,
  translateFontSize = 50,
  rId,
}) => {
  const theme = useTheme();

  if (!item) return null;

  const verseContent = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: -1,
      }}
    >
      {!!item?.verseId && (
        <>
          <Divider sx={{ flex: 1, borderColor: "primary.main" }}>
            <Box
              sx={{
                display: "flex",
                px: 1,
                justifyContent: "center",
                alignItems: "center",
                py: 0.5,
              }}
            >
              {rId < 18 && (
                <Link href={`/${locale}/miskat/${rId}/${item.verseId}`}>
                  <IconButton>
                    <Image
                      alt="Text"
                      width={28}
                      height={28}
                      src={`/icons/${theme.palette.mode}/tools/text.svg`}
                    />
                  </IconButton>
                </Link>
              )}
              <IconButton>
                <Image
                  alt="Sound"
                  width={22}
                  height={22}
                  src={`/icons/${theme.palette.mode}/tools/sound.svg`}
                />
              </IconButton>
              <IconButton>
                <Image
                  alt="Video"
                  width={22}
                  height={22}
                  src={`/icons/${theme.palette.mode}/tools/video.svg`}
                />
              </IconButton>
            </Box>
          </Divider>
        </>
      )}
    </Box>
  );

  const verseText = (
    <ButtonBase
      component="div"
      sx={{
        pb: 2,
        flex: 1,
        width: 1 / 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <VerseText
        {...{
          locale,
          item,
          translateFontSize,
          quranFontSize,
          formats,
        }}
      />
    </ButtonBase>
  );

  return (
    <Box
      id={`verse-${item?.verseId}`}
      sx={{
        color: "primary.dark",
        a: {
          textDecoration: "none",
          color: "primary.dark",
        },
        ...(!!selected && {
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "primary.dark" : "primary.light",
          borderRadius: 5,
          border: 1,
          color: "text.primary",
          borderColor: "primary.dark",
          a: {
            textDecoration: "none",
            color: "text.primary",
          },
        }),
      }}
    >
      {item?.verseId !== 0 ? (
        <Link href={`/${locale}/verse/${seriesId}/${item.verseId}`}>
          {verseContent}
          {verseText}
        </Link>
      ) : (
        <>
          {verseContent}
          {verseText}
        </>
      )}
    </Box>
  );
};

