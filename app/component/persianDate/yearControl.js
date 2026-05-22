"use client";

import React from "react";
import { alpha, Box, Grid, Typography } from "@mui/material";
import { MobileMonthSection } from "./mobileMonthSection";
import { desktopValues, mobileStickyTopOffset } from "@/core/config/values";
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
          top: mobileStickyTopOffset(
            desktop,
            desktopValues({}).CALENDAR_Tools_HEIGHT
          ),
          bgcolor: (theme) => alpha(theme.palette.background.default, 1),
          backdropFilter: "blur(5px)",
          zIndex: 8,
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

export const YearControl = ({ year = "1405", list, onSelect, desktop }) => {
  const [listMonths, setMonthList] = React.useState([]);
  const event = useEventCalendarStore((state) => state.event);
  const setEvent = useEventCalendarStore((state) => state.setEvent);

  React.useEffect(() => {
    if (!event?.scroll) return;

    try {
      scroller.scrollTo(event.scroll, {
        offset: -(
          (desktop ? 64 : 0) +
          desktopValues({}).CALENDAR_Tools_HEIGHT +
          desktopValues({}).CALENDAR_APP_HEIGHT +
          60
        ),
        smooth: true,
        duration: 0,
      });
    } catch (error) {
      console.warn("Calendar scroll target missing:", event.scroll, error);
    }
  }, [event, desktop]);

  React.useEffect(() => {
    const currentJalaliYear = format(new Date(), "yyyy");

    if (String(currentJalaliYear) !== String(year)) return;

    const timer = window.setTimeout(() => {
      setEvent({
        scroll: `month-${format(new Date(), "M")}`,
        title: "noEvent",
      });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [year, setEvent]);

  React.useEffect(() => {
    if (!list?.hijri || !list?.hijri_month) {
      setMonthList([]);
      return;
    }

    const months = _.compact(
      _.map(_.range(1, 13), (month) => {
        const monthHijri = list.hijri?.[`${month}`];
        if (!monthHijri?.[0] || !monthHijri?.[1]) {
          return null;
        }

        const first_hijri = monthHijri[0];
        const last_hijri = monthHijri[1];
        const dString = `${year}-${month < 10 ? "0" + month : month}-01`;

        const date = parse(dString, "yyyy-MM-dd", new Date(), {
          locale: "fa-IR",
        });
        const lastDayOfMonth = endOfMonth(date);
        const firstDay = jalaliWeekDayIndex[getDay(date)];
        const leap = isLeapYear(date);
        const monthDays = getMonthCount(month, leap);
        const len = Math.ceil((firstDay + monthDays) / 7);

        const firstMonthName =
          list.hijri_month[first_hijri?.hijri_month - 1] ?? "";
        const lastMonthName =
          list.hijri_month[last_hijri?.hijri_month - 1] ?? "";

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
            last_hijri.day -
            last_hijri.hijri_day +
            first_hijri.hijri_day -
            1,
          hijri_name: `${firstMonthName} - ${lastMonthName}`,
          hijri_year: digitsEnToFa(first_hijri?.hijri_year),
          monthDays,
          gregorian: `${gFormat(date, "MMM")} - ${gFormat(
            lastDayOfMonth,
            "MMM"
          )} ${gFormat(date, "yyyy")}`,
        };
      })
    );

    setMonthList(months);
  }, [year, list]);

  return (
    <>
      <DateToolbar year={year} desktop={desktop} />
      {listMonths.length === 0 ? (
        <Typography m={4} textAlign="center" color="text.secondary">
          داده ماه‌های تقویم سال {year} کامل نیست.
        </Typography>
      ) : (
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
      )}
    </>
  );
};
