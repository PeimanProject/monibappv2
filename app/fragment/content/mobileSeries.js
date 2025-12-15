"use client";

import { Box, Container, alpha } from "@mui/material";
import React from "react";
import _ from "lodash";
import { SearchControl } from "@/app/component/search";
import { SeriesItemKey } from "@/app/component/seriesItemKey";
import { desktopValues } from "@/core/config/values";
import { TabNormalItem, TabStyle } from "@/app/component/tabStyle";
import { useTranslate } from "@/core/useTranslation";

export const MobileSeries = ({ list, nhj, sahifa, desktop, type, quran }) => {
  const [valueSearch, setValue] = React.useState("");
  const { get } = useTranslate()

  const handleChange = React.useCallback((event) => {
    setValue(event?.target?.value);
  }, []);

  const getList = React.useMemo(() => {
    return list;
  }, [list]);

  const currentList = getList;

  const [, setNhjValue] = React.useState("sermon");
  const [index, setIndex] = React.useState(0);

  const handleNhjChange = React.useCallback(
    (value, index) => () => {
      setNhjValue(value);
      setIndex(index);
    },
    []
  );

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          py: 2,
          position: "sticky",
          top: desktop ? 64 : desktopValues({}).APP_HEIGHT,
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
          backdropFilter: "blur(5px)",
          zIndex: 8,
        }}
      >
        {quran && type !== "miskat" && <Box
          sx={{
            display: "flex",
            justifyContent: desktop ? "flex-start" : "center",
          }}
        >
          <SearchControl onChange={handleChange} />
        </Box>}
        {!!nhj && (
          <Box
            sx={{
              display: "flex",
              justifyContent: desktop ? "flex-start" : "center",
              mt: 1,
            }}
          >
            <TabStyle index={index}>
              <TabNormalItem
                text={get("Series.sermon")}
                value={"sermon"}
                index={0}
                selected={index === 0}
                onChange={handleNhjChange}
              />
              <TabNormalItem
                text={get("Series.letter")}
                value={"letter"}
                index={1}
                selected={index === 1}
                onChange={handleNhjChange}
              />
              <TabNormalItem
                text={get("Series.wisdom")}
                value={"wisdom"}
                index={2}
                selected={index === 2}
                onChange={handleNhjChange}
              />
            </TabStyle>
          </Box>
        )}
      </Box>

      <Box sx={{ pt: 2, pb: 22, display: "flex", flexWrap: "wrap" }}>
        {_.map(currentList, (value, indexList) => {
          return (
            (!desktop || !nhj || value.type === index + 1) && (
              // <Grid
              //   key={indexList}
              //   size={{
              //     xs:
              //       type === "miskat"
              //         ? 6
              //         : !!!nhj || value.type === index + 1
              //         ? 12
              //         : 0,
              //     md: sp ? 6 : 4,
              //   }}
              // >
              <SeriesItemKey
                {...value}
                key={indexList}
                row={type === "miskat" ? 6 : 12}
                locale={"fa"}
                showRow={!!!nhj && !!!sahifa}
                value={valueSearch}
                showItem={!!!nhj || value.type === index + 1}
                type={type}
              />
              // </Grid>
            )
          );
        })}
      </Box>
      {/* <Box
        sx={{
          display: "flex",

          flexDirection: "column",
        }}
      ></Box> */}
    </Container>
  );
};
