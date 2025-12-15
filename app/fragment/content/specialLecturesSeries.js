"use client";

import { Box, Container, alpha } from "@mui/material";
import React from "react";
import _ from "lodash";
import { useLocale, useTranslations } from "next-intl";
import { SearchControl } from "@/app/component/search";
import { SeriesItemKey } from "@/app/component/seriesItemKey";
import { desktopValues } from "@/core/config/values";
import { TabNormalItem, TabStyle } from "@/app/component/tabStyle";

export const MobileSeries = ({ list, nhj, sahifa }) => {
  const [valueSearch, setValue] = React.useState("");
  const t = useTranslations("Series");
  const locale = useLocale();

  const handleChange = React.useCallback((event) => {
    setValue(event?.target?.value);
  }, []);

  const getList = React.useMemo(() => {
    return list;
  }, [list]);

  const [nhjValue, setMedia] = React.useState("sermon");
  const [index, setIndex] = React.useState(0);

  const handleNhjChange = React.useCallback(
    (value, index) => () => {
      setMedia(value);
      setIndex(index);
    },
    []
  );

  const currentList = getList;

  return (
    <Container>
      <Box
        sx={{
          py: 2,

          position: "sticky",
          top: desktopValues({}).APP_HEIGHT,
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
          backdropFilter: "blur(5px)",
          zIndex: 8,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SearchControl onChange={handleChange} />
        </Box>
        {!!nhj && (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TabStyle index={index} count={3}>
              <TabNormalItem
                index={0}
                value={"sermon"}
                text={t("sermon")}
                onChange={handleNhjChange}
                selected={nhjValue === "sermon"}
              />
              <TabNormalItem
                index={1}
                value={"letter"}
                text={t("letter")}
                onChange={handleNhjChange}
                selected={nhjValue === "letter"}
              />
              <TabNormalItem
                index={2}
                value={"wisdom"}
                text={t("wisdom")}
                onChange={handleNhjChange}
                selected={nhjValue === "wisdom"}
              />
            </TabStyle>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          pt: 2,
          pb: 22,
          flexDirection: "column",
        }}
      >
        {_.map(currentList, (value, indexList) => {
          return (
            <SeriesItemKey
              key={indexList}
              {...value}
              locale={locale}
              showRow={!!!nhj && !!!sahifa}
              showItem={!!nhj ? value.type === index + 1 : true}
              value={valueSearch}
            />
          );
        })}
      </Box>
    </Container>
  );
};
