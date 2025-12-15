"use client";

import LoadingAnimations from "@/app/component/loading";
import { SearchControl } from "@/app/component/search";
import { TabNormalItem, TabStyle } from "@/app/component/tabStyle";
import {
  Box,
  Container,
  Divider,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from "@mui/material";
import React from "react";
import _ from "lodash";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { desktopValues } from "@/core/config/values";
import Link from "next/link";
import { Book } from "./book";
import { useTranslate } from "@/core/useTranslation";

export const MobileSearch = ({ desktop, q }) => {
  const [value, setValue] = React.useState("tag");
  const [query, setQuery] = React.useState("");
  const [search, setSearch] = React.useState(false);
  const [resultQuran, setResultQuran] = React.useState(null);
  const [resultTag, setResultTag] = React.useState(null);
  const [resultBook, setResultBook] = React.useState(null);
  const [index, setIndex] = React.useState(0);
  const [filter, setFilter] = React.useState("all");

  React.useEffect(() => {
    const savedQueryQuran = localStorage.getItem("search_query");
    const savedResultQuran = localStorage.getItem("search_result");
    const savedQueryTag = localStorage.getItem("search_query_tag");
    const savedResultTag = localStorage.getItem("search_result_tag");
    const savedQueryBook = localStorage.getItem("search_query_book");
    const savedResultBook = localStorage.getItem("search_result_book");

    if (savedQueryQuran && savedResultQuran) {
      setQuery(savedQueryQuran);
      setResultQuran(JSON.parse(savedResultQuran));
    }

    if (savedQueryTag && savedResultTag) {
      setQuery(savedQueryTag);
      setResultTag(JSON.parse(savedResultTag));
    }

    if (savedQueryBook && savedResultBook) {
      setQuery(savedQueryBook);
      setResultBook(JSON.parse(savedResultBook));
    }
  }, []);

  const { get } = useTranslate()
  const handleChange = React.useCallback(
    (value, index) => () => {
      setValue(value);
      setIndex(index);
    },
    []
  );

  const handleValueChange = React.useCallback((event) => {
    setQuery(event.target.value);
  }, []);

  const handleSearch = React.useCallback(
    async (q) => {
      const gy = q || query;
      if (!!!gy) return;

      setSearch(true);
      const req = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ query: gy, doc: value }),
      });
      const list = await req.json();
      setSearch(false);
      if (value === "quran") {
        setResultQuran(list);
        localStorage.setItem("search_query", gy);
        localStorage.setItem("search_result", JSON.stringify(list));
      } else if (value === "book") {
        setResultBook(list);
        localStorage.setItem("search_query_book", gy);
        localStorage.setItem("search_result_book", JSON.stringify(list));
      } else {
        setResultTag(list);
        localStorage.setItem("search_query_tag", gy);
        localStorage.setItem("search_result_tag", JSON.stringify(list));
      }
    },
    [query, value]
  );

  const handleKeyDown = React.useCallback(
    (event) => {
      if (event.key === "Enter") {
        handleSearch();
        // You can trigger search or submit logic here
      }
    },
    [handleSearch]
  );

  React.useEffect(() => {
    setQuery(q);
    if (q) {
      handleSearch(q);
    }
  }, [q]);

  return (
    <>
      <Box
        sx={{
          minHeight: 50,
          display: "flex",
          bgcolor: "background.default",
          alignItems: "center",
          flexDirection: "column",
          top: desktop ? 64 : desktopValues({}).APP_HEIGHT,
          justifyContent: "center",
          position: "sticky",
          zIndex: 8,
          ...(desktop && { mt: 2 }),
        }}
      >
        <TabStyle index={index} wSize={100}>
          <TabNormalItem
            text={get("Search.subject")}
            value={"tag"}
            index={0}
            wSize={100}
            selected={value === "tag"}
            onChange={handleChange}
          />
          <TabNormalItem
            text={get("Search.quran")}
            value={"quran"}
            index={1}
            wSize={100}
            selected={value === "quran"}
            onChange={handleChange}
          />
          <TabNormalItem
            text={get("Search.book")}
            value={"book"}
            index={2}
            wSize={100}
            selected={value === "book"}
            onChange={handleChange}
          />
        </TabStyle>
        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "center",
            width: 1 / 1,
            maxWidth: 320,
          }}
        >
          <SearchControl
            maxWidth={500}
            onChange={handleValueChange}
            onKeyDown={handleKeyDown}
            onSearch={handleSearch}
          />
        </Box>
        {!!resultQuran && (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              px: 2,
              maxWidth: 500,
              width: 300,
            }}
          >
            <Box sx={{ flex: 1 }} />
            <Typography variant="caption" color="text.secondary">
              {get("Search.resultCount")}:
              {digitsEnToFa(
                value === "quran"
                  ? `${resultQuran?.total.value}`
                  : `${_.filter(resultTag?.list, (item) => {
                    if (filter === "all") return true;
                    if (filter === "1") return item.main_id == 1;
                    if (filter === "2") return item.main_id == 3;
                    if (filter === "4") return item.main_id == 4;
                    return false;
                  }).length
                  }`
              )}
            </Typography>
          </Box>
        )}
        {value === "book" && (

          <Book resultBook={resultBook} />

        )}
        {value === "tag" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",

              boxSizing: "border-box",
              border: 1,
              borderColor: "primary.main",
              borderRadius: 3,
              p: 0.5,
              mt: 1,
            }}
          >
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="all"
                name="radio-buttons-group"
                onChange={(e) => setFilter(e.target.value)}
              >
                <FormControlLabel value="all" control={<Radio />} label="همه" />
                <FormControlLabel value="1" control={<Radio />} label="قرآن" />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="نهج‌البلاغه"
                />
                <FormControlLabel value="4" control={<Radio />} label="صحیفه" />
              </RadioGroup>
            </FormControl>
          </Box>
        )}
      </Box>
      <Container
        sx={{
          pb: 12,
          pt: 2,
          a: {
            color: "text.primary",
            textDecoration: "none",
          },
        }}
      >
        {!!search && <LoadingAnimations />}
        {value === "quran" &&
          _.map(
            resultQuran?.list,
            ({ highlight, surah_name, verse_id, page_no, surah_id }, index) => {
              return (
                <Link
                  href={`/surah/${surah_id}/${verse_id}`}
                  key={index}
                >
                  <Box>
                    <Box sx={{ my: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Typography sx={{ mr: 1 }} variant="caption">
                          {surah_name}
                        </Typography>
                        <Typography sx={{ mx: 1 }} variant="caption">
                          /
                        </Typography>
                        <Typography sx={{ mx: 1 }} variant="caption">
                          {t("verse")} {digitsEnToFa(`${verse_id}`)}
                        </Typography>
                        <Typography sx={{ mx: 1 }} variant="caption">
                          /
                        </Typography>
                        <Typography sx={{ mx: 1 }} variant="caption">
                          {t("page")} {digitsEnToFa(`${page_no}`)}
                        </Typography>
                        {/* <Box sx={{ flex: 1 }} />
                  <Button variant="outlined" color="inherit" size="small">
                    <Typography variant="caption">{t("play")}</Typography>
                  </Button> */}
                      </Box>
                      <Typography
                        dangerouslySetInnerHTML={{ __html: highlight }}
                        sx={{
                          fontWeight: "bold",
                          em: { color: "primary.dark" },
                        }}
                      ></Typography>
                    </Box>
                    <Divider sx={{ my: 4, borderColor: "primary.main" }} />
                  </Box>
                </Link>
              );
            }
          )}

        {value === "tag" &&
          _.map(
            _.filter(resultTag?.list, (item) => {
              if (filter === "all") return true;
              if (filter === "1") return item.main_id == 1;
              if (filter === "2") return item.main_id == 3;
              if (filter === "4") return item.main_id == 4;
              return false;
            }),
            (
              {
                highlight_title,
                lecture_id,
                title,
                contextName,
                row_number,
                start_time,
              },
              index
            ) => {
              return (
                <Link
                  href={`/player/${lecture_id}?time=${start_time}`}
                  key={index}
                >
                  <Box>
                    <Box sx={{ my: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Typography sx={{ mr: 1 }} variant="caption">
                          {contextName}
                        </Typography>
                        <Typography sx={{ mx: 1 }} variant="caption">
                          /
                        </Typography>
                        <Typography sx={{ mr: 1 }} variant="caption">
                          {"جلسه"} {digitsEnToFa(`${row_number}`)}
                        </Typography>
                      </Box>
                      <Typography
                        dangerouslySetInnerHTML={{
                          __html: highlight_title || title,
                        }}
                        sx={{
                          fontWeight: "bold",
                          em: { color: "primary.dark" },
                        }}
                      ></Typography>
                    </Box>
                    <Divider sx={{ my: 4, borderColor: "primary.main" }} />
                  </Box>
                </Link>
              );
            }
          )}
      </Container>
    </>
  );
};
