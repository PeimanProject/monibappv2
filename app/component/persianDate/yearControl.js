"use client";

import React from "react";
import { alpha, Box, Grid, Typography } from "@mui/material";
import { MobileMonthSection } from "./mobileMonthSection";
import { desktopValues } from "@/core/config/values";
import { parse, format, endOfMonth, getDay, isLeapYear } from "date-fns-jalali";
import { format as gFormat } from "date-fns";
import _ from "lodash";
import { getMonthCount, jalaliWeekDayIndex } from "./dayBar";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { scroller } from "react-scroll";
import { DateToolbar } from "./dateToolbar";
import { useEventCalendarStore } from "@/store/useEventCalendar";

const MonthSection = ({
  date,
  selectedDate,
  onSelect,
  monthName,
  gregorian,
  year,
  list,
  month,
  hijri_name,
  hijri_year,
  desktop,
  ...props
}) => {
  return (
    <>
      <Box
        id={`month-${month}`}
        sx={{
          position: "sticky",
          top:
            (desktop ? 64 : desktopValues({}).APP_HEIGHT) +
            desktopValues({}).CALENDAR_Tools_HEIGHT,
          bgcolor: (theme) => alpha(theme.palette.background.default, 1),
          backdropFilter: "blur(5px)",
          zIndex: 999,
        }}
      >
        <Box
          sx={{
            px: 3,
            height: desktopValues({}).CALENDAR_APP_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption" sx={{ textAlign: "left" }}>
            {hijri_name}
          </Typography>

          <Box
            sx={{
              left: "50%",
              transform: "translate(-50%,0)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              {monthName}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",

              flexDirection: "column",
            }}
          >
            <Typography sx={{ textAlign: "right" }} variant="caption">
              {gregorian}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ pb: 5, px: 1 }}>
        <MobileMonthSection
          date={date}
          selectedDate={selectedDate}
          onSelect={onSelect}
          list={list}
          desktop={desktop}
          {...props}
        />
      </Box>
    </>
  );
};

export const YearControl = ({ year = "1404", list, onSelect, desktop }) => {
  const [listMonths, setMonthList] = React.useState([]);
  const event = useEventCalendarStore((state) => state.event);
  const setEvent = useEventCalendarStore((state) => state.setEvent);

  React.useEffect(() => {
    if (!!event?.scroll) {
      scroller.scrollTo(event?.scroll, {
        offset: -(
          desktopValues({}).APP_HEIGHT +
          desktopValues({}).CALENDAR_APP_HEIGHT +
          desktopValues({}).CALENDAR_Tools_HEIGHT +
          60
        ),
      });
    }
  }, [event]);

  React.useEffect(() => {
    const y = format(new Date(), "yyyy");

    if (y === year)
      setTimeout(
        () =>
          setEvent({
            scroll: `month-${format(new Date(), "M")}`,
            title: "noEvent",
          }),
        [1000]
      );
  }, []);

  React.useEffect(() => {
    // setDate(new Date().toISOString().substring(0, 10));
    setMonthList(
      _.map(_.range(1, 13), (month) => {
        const dString = `${year}-${month < 10 ? "0" + month : month}-01`;

        const date = parse(dString, "yyyy-MM-dd", new Date(), {
          locale: "fa-IR",
        });
        const lastDayOfMonth = endOfMonth(date);
        const firstDay = jalaliWeekDayIndex[getDay(date)];
        const leap = isLeapYear(date);
        const monthDays = getMonthCount(month, leap);
        const len = Math.ceil((firstDay + monthDays) / 7);

        const first_hijri = list.hijri[`${month}`][0];
        const last_hijri = list.hijri[`${month}`][1];

        return {
          month,
          date,
          monthName: format(date, "MMMM"),
          year: format(date, "yyyy"),
          lastDayOfMonth,
          firstDay,
          len,
          first_hijri,
          last_hijri,
          hijri_len:
            last_hijri.day - last_hijri.hijri_day + first_hijri.hijri_day - 1,
          hijri_name: `${list.hijri_month[first_hijri?.hijri_month - 1]} - ${list.hijri_month[last_hijri?.hijri_month - 1]
            }`,
          hijri_year: digitsEnToFa(first_hijri?.hijri_year),
          monthDays,
          gregorian: `${gFormat(date, "MMM")} - ${gFormat(
            lastDayOfMonth,
            "MMM"
          )} ${gFormat(date, "yyyy")}`,
        };
      })
    );
  }, []);

  return (
    <>
      <DateToolbar year={year} desktop={desktop} />
      <Grid container sx={{ pb: 32 }} spacing={2}>
        {_.map(
          _.orderBy(listMonths, (v) => v.month),
          (props, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <MonthSection
                desktop={desktop}
                {...props}
                list={list}
                onSelect={onSelect}
              />
            </Grid>
          )
        )}
      </Grid>
    </>
  );
};
