"use client";

import React from "react";
import {
  Box,
  Typography,
  ButtonBase,
  IconButton,
  useTheme,
  Divider,
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
  translateFontSize = 50,
  quranFontSize = 50,
}) => {
  const [ref, inView] = useInView();
  const setVerse = useCurrentVerseStore((state) => state.setVerse);
  const theme = useTheme();

  React.useEffect(() => {
    if (!!inView) {
      setVerse(item);
    }
  }, [inView, item, setVerse]);

  return (
    !!item && (
      <Box>
        <Box ref={ref} sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-start",
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
                textAlign: "left",

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
      </Box>
    )
  );
};

export const DesktopVerse = ({
  item,
  formats = "list",
  locale,
  seriesId,
  selected,
  quranFontSize = 50,
  translateFontSize = 50,
  type,
  rId,
  surahId,
}) => {
  const theme = useTheme();

  const V = () => (
    <ButtonBase
      component="div"
      sx={{
        py: 2,
        flex: 1,
        width: 1 / 1,
        display: "flex",
        flexDirection: "row",
        position: "relative",
        justifyContent: "flex-start",
        ...(type === "miskat" && {
          borderBottom: 1,
          borderColor: "primary.main",
        }),
      }}
    >
      <VerseText
        {...{
          locale,
          item,
          translateFontSize,
          quranFontSize,
          formats,
          desktop: true,
        }}
      />
    </ButtonBase>
  );

  return (
    <>
      {!!item?.verseId && type !== "miskat" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
            mb: -2,
            mt: 1,
          }}
        >
          <Divider sx={{ flex: 1, borderColor: "primary.main" }} />
          <Box
            sx={{
              display: "flex",
              px: 1,
              justifyContent: "center",
              alignItems: "center",
              py: 0.5,
            }}
          >
            <IconButton>
              <Image
                alt="Play"
                width={22}
                height={22}
                src={`/icons/${theme.palette.mode}/tools/sound.svg`}
              />
            </IconButton>
            {rId < 18 && (
              <Link href={`/${locale}/miskat/${rId}/${item.verseId}`}>
                <ButtonBase title="متن مشکات">
                  <Image
                    alt="Play"
                    width={68}
                    height={38}
                    src={`/icons/miskat.svg`}
                  />
                </ButtonBase>
              </Link>
            )}
            <IconButton>
              <Image
                alt="Play"
                width={22}
                height={22}
                src={`/icons/${theme.palette.mode}/tools/video.svg`}
              />
            </IconButton>
          </Box>
        </Box>
      )}

      <Box
        id={`verse-${item?.verseId}`}
        sx={{
          color: "primary.dark",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: 1 / 1,

          a: {
            textDecoration: "none",
            color: "primary.dark",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flex: 1,
          },
          ...(!!selected && {
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "primary.dark" : "primary.light",
            borderRadius: 5,
            border: 0,
            color: "text.primary",
            borderColor: "primary.dark",
            // a: {
            //   textDecoration: "none",
            //   color: "text.primary",
            // },
          }),
        }}
      >
        {item.verseId ? (
          <Link
            href={
              type === "miskat"
                ? `/${locale}/miskat/${surahId}/${item.verseId}`
                : `/${locale}/verse/${seriesId}/${item.verseId}`
            }
          >
            <V />
          </Link>
        ) : (
          <V />
        )}
      </Box>
    </>
  );
};
