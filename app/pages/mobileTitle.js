"use client";

import React from "react";
import { Box, Container, Typography, alpha, Button } from "@mui/material";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useLocale, useTranslations } from "next-intl";
import { desktopValues } from "@/core/config/values";
import Link from "next/link";
import { useCurrentVerseStore } from "@/store/useQuranStore";

export const MobileTitle = ({
  title,
  description,
  lectureCount,
  lastCourseId,
  newCourseId,
  mainId,
  value = "lecture",
  onChange,
  rId,
}) => {
  const t = useTranslations("Lecture");
  const locale = useLocale();
  const verse = useCurrentVerseStore((state) => state.verse);

  return (
    <>
      {(value === "lecture" || value === "quran") && (
        <Box
          sx={{
            height: desktopValues({}).TITLE_HEIGHT,
            bgcolor: (theme) => alpha(theme.palette.primary.dark, 0.8),
            backdropFilter: "blur(5px)",
            boxShadow: 1,
            position: "sticky",
            top: desktopValues({}).APP_HEIGHT,
            zIndex: 22,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Container maxWidth="sm">
            <Box
              sx={{
                display: "flex",

                width: 1 / 1,
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{ fontWeight: "bold" }}
                  component={"h1"}
                  variant="body1"
                >
                  {title}
                </Typography>
                <Typography sx={{ mt: 1 }}>{description}</Typography>
                {value === "lecture" && (
                  <Typography>
                    {digitsEnToFa(`${lectureCount}`)} {t("lecture")}
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: 1 }} />
              {mainId === 1 && (
                <Box>
                  {!!lastCourseId && value === "lecture" && (
                    <Box sx={{ pl: 1 }}>
                      <Link href={`/${locale}/series/${lastCourseId}`}>
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          sx={{ minWidth: 120 }}
                        >
                          {mainId === 1
                            ? t("previousInterpretationRound")
                            : t("previousRound")}
                        </Button>
                      </Link>
                    </Box>
                  )}

                  {!!newCourseId && value === "lecture" && (
                    <Box sx={{ pl: 1 }}>
                      <Link href={`/${locale}/series/${newCourseId}`}>
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          sx={{ minWidth: 120 }}
                        >
                          {mainId === 1
                            ? t("newInterpretationRound")
                            : t("newRound")}
                        </Button>
                      </Link>
                    </Box>
                  )}
                  {mainId === 1 && (
                    <Box
                      sx={{
                        pl: 1,
                        mt: 0.5,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={onChange(
                          value === "quran" ? "lecture" : "quran",
                          1
                        )}
                        sx={{ minWidth: 120 }}
                      >
                        {t(value === "quran" ? "lectures" : "quran")}
                      </Button>
                      {value === "quran" && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            px: 2,
                            mt: 1,
                          }}
                        >
                          <Typography sx={{ mr: 1 }}>{t("page")}</Typography>
                          <Box
                            sx={{
                              bgcolor: "background.paper",
                              borderRadius: 1,
                              px: 1,
                              py: 0.2,
                            }}
                          >
                            {digitsEnToFa(verse?.pageNo || "-")}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Container>
        </Box>
      )}

      {/* {value === "quran" && (
        <Box
          sx={{
            height: desktopValues({}).TITLE_HEIGHT_MIN,
            bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
            backdropFilter: "blur(5px)",
          }}
        >
          <Container maxWidth="sm">
            <Box
              sx={{
                display: "flex",
                py: 2,
                width: 1 / 1,
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontWeight: "bold" }}
                component={"h1"}
                variant="body1"
              >
                {title}
              </Typography>
              <Typography sx={{ mx: 1 }}>{description}</Typography>
            </Box>
          </Container>
        </Box>
      )} */}
    </>
  );
};
