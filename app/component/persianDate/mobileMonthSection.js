import { Box, Typography, ButtonBase } from "@mui/material";
import React from "react";
import _ from "lodash";
import { holidayColor, weekDays, jalaliWeekDay } from "./dayBar";
import { addDays, isEqual, format } from "date-fns-jalali";
import { format as gFormat } from "date-fns";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { desktopValues, mobileStickyTopOffset } from "@/core/config/values";
import { useEventCalendarStore } from "@/store/useEventCalendar";
import { useTranslate } from "@/core/useTranslation";

const CellSection = ({ children }) => {
  return (
    <Box
      component={"section"}
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
};

const CellDaySection = ({
  numberDay,
  currentDay,
  day,
  date,
  onSelect,
  isInMonth,
  list,
  firstDay,
  numberHijri,
  hijri_month,
}) => {
  const [currentDate, setCurrentDate] = React.useState(null);
  const [selected, setSelected] = React.useState(false);
  const [lecture, setLecture] = React.useState(null);
  const event = useEventCalendarStore((state) => state?.event);

  React.useEffect(() => {
    setCurrentDate(addDays(date, currentDay)?.toISOString().substring(0, 10));
  }, [day, date, currentDay]);

  React.useEffect(() => {
    if (!!currentDate && !!list) {
      const isSelected = list?.lecture.some((item) =>
        isEqual(item.date, currentDate)
      );
      const lec = _.find(list?.lecture, (item) =>
        isEqual(item.date, currentDate)
      );
      setLecture(lec);
      setSelected(isSelected);
    }
  }, [currentDate, list]);

  const isEvent = React.useMemo(() => {
    if (_.isFunction(event?.data)) {
      return event.data({ month: hijri_month, day: numberHijri });
    }
    return false;
  }, [event, hijri_month]);

  return (
    !!currentDate && (
      <Box sx={{ flex: 1 }} id={`s-${format(currentDate, "yyyy-MM-dd")}`}>
        <ButtonBase
          component={"section"}
          id={`day-${numberHijri}-${hijri_month}`}
          onClick={onSelect({ currentDate, numberHijri, hijri_month })}
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            position: "relative",
            boxSizing: "border-box",
            ...(isInMonth && {
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "background.default"
                  : "primary.light",
            }),
            ...(day === 6 && { color: holidayColor }),

            ...(!!selected &&
              !!lecture?.file_type &&
              isInMonth && {
              bgcolor: "primary.dark",
              color: "white",
            }),
            ...(!!isEvent &&
              !!isInMonth && {
              color: "white",
              bgcolor: "var(--event-color)",
            }),
            py: 0.1,
            m: 0.2,
            border: 2,
            borderColor: "transparent",
            ...(isEqual(
              format(new Date().toISOString().substring(0, 10), "yyyy-MM-dd"),
              format(currentDate, "yyyy-MM-dd")
            ) && {
              border: 2,
              borderColor: "var(--event-color)",
              bgcolor: "background.paper",
              span: {
                color: "text.primary",
              },
            }),
            ...(!!lecture &&
              lecture?.file_type == null && {
              bgcolor: "#c4d0cc",
            }),
            backgroundSize: `10px 10px`,
            // backgroundSize: `4px 4px`,
          }}
        >
          {isInMonth && (
            <>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "light",
                  ...(!!selected &&
                    !!isEvent && {
                    bgcolor: "primary.dark",
                    px: 1,
                  }),
                  ...(!!lecture &&
                    lecture?.file_type == null && {
                    // bgcolor: "primary.main",
                    px: 1,
                  }),
                }}
              >
                {digitsEnToFa(numberDay - firstDay)}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  color: "text.secondary",
                  ...(day === 6 && { color: holidayColor }),
                  ...(!!selected && { color: "#becdc6" }),
                  ...(!!isEvent && {
                    color: "white",
                  }),
                  mt: 0.2,

                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  ...(!!lecture &&
                    lecture?.file_type == null && {
                    bgcolor: "primary.main",
                    color: "black",
                    width: "auto",
                    px: 1,
                  }),
                }}
              >
                <Typography variant="caption">
                  {digitsEnToFa(numberHijri.toString().padStart(2, "0"))}
                </Typography>
                <Box sx={{ mx: 0.5 }} />
                <Typography variant="caption">
                  {gFormat(currentDate, "dd")}
                </Typography>
              </Box>
            </>
          )}
        </ButtonBase>
      </Box>
    )
  );
};

const Cell = ({
  day,
  firstDay,
  month,
  date,
  onSelect,
  selectedDate,
  list,
  monthDays,
  numberDay,
  first_hijri,
  last_hijri,
  hijri_len,
}) => {
  const isInMonth = React.useMemo(
    () => firstDay < numberDay && numberDay <= monthDays + firstDay,
    [firstDay, numberDay, month]
  );

  const hijri = React.useMemo(() => {
    let hijri_month = first_hijri.hijri_month;
    let d = first_hijri.hijri_day + (numberDay - firstDay - 1);

    if (d > hijri_len) {
      d = d - hijri_len;
      hijri_month = last_hijri.hijri_month;
    }
    return { numberHijri: d, hijri_month };
  }, [first_hijri, last_hijri, numberDay, firstDay, hijri_len]);

  return (
    <CellDaySection
      {...{
        currentDay: numberDay - firstDay,
        ...hijri,
        weekDay: day,
        date,
        day,
        onSelect,
        selectedDate,
        isInMonth,
        list,
        firstDay,
        numberDay,
      }}
    />
  );
};

export const MobileMonthSection = ({
  date,
  onSelect,
  selectedDate,
  list,
  month,
  firstDay,
  len,
  monthDays,
  first_hijri,
  last_hijri,
  hijri_len,
  desktop,
}) => {
  const { get } = useTranslate()
  return (
    <>
      <Box
        sx={{
          height: 50,
          display: "flex",
          position: "sticky",
          bgcolor: "background.default",
          zIndex: 99,

          top: mobileStickyTopOffset(
            desktop,
            desktopValues({}).CALENDAR_Tools_HEIGHT,
            desktopValues({}).CALENDAR_APP_HEIGHT
          ),
        }}
      >
        {_.map(_.range(0, 7), (day) => (
          <CellSection weekDay={day} key={day}>
            <Typography
              variant="caption"
              sx={{ ...(day === 6 && { color: holidayColor }) }}
            >
              {get(`Scheduler.${weekDays[jalaliWeekDay[day]]}`)}
            </Typography>
          </CellSection>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          overflow: "hidden",
        }}
      >
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {_.map(_.range(0, len), (row) => (
            <Box
              key={row}
              sx={{
                display: "flex",
                flex: 1,
                minHeight: 30,
              }}
            >
              {_.map(_.range(0, 7), (day) => {
                const numberDay = day + 1 + row * 7;
                return (
                  <Cell
                    {...{
                      day,
                      row,
                      date,
                      firstDay,
                      month,
                      onSelect,
                      selectedDate,
                      list,
                      monthDays,
                      numberDay,
                      first_hijri,
                      last_hijri,
                      hijri_len,
                    }}
                    key={day}
                  />
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};
