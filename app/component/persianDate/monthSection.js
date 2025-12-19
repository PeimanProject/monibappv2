import { Box, Typography, ButtonBase, lighten } from "@mui/material";
import React from "react";
import _ from "lodash";
import {
  holidayColor,
  jalaliWeekDayIndex,
  weekDays,
  jalaliWeekDay,
  getMonthCount,
} from "./dayBar";
import {
  getMonth,
  addDays,
  getDate,
  getDay,
  isEqual,
  format,
  parse,
} from "date-fns-jalali";
import { digitsEnToFa } from "@persian-tools/persian-tools";
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
  children,
  currentDay,
  day,
  date,
  onSelect,
  selectedDate,
  isInMonth,
}) => {
  const [currentDate, setCurrentDate] = React.useState(null);

  React.useEffect(() => {
    setCurrentDate(
      addDays(date, day - currentDay)
        ?.toISOString()
        .substring(0, 10)
    );
  }, [day, date, currentDay]);

  return (
    !!currentDate && (
      <ButtonBase
        component={"section"}
        onClick={onSelect(currentDate)}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          position: "relative",
          ...(isInMonth && {
            bgcolor: "primary.light",
          }),

          m: 0.2,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            ...(!!selectedDate &&
              isEqual(
                format(selectedDate, "yyyy-MM-dd"),
                format(currentDate, "yyyy-MM-dd")
              ) && {
              bgcolor: (theme) => lighten(theme.palette.primary.light, 0.5),
            }),
          }}
        >
          {children}
        </Box>
        {isEqual(
          format(new Date().toISOString().substring(0, 10), "yyyy-MM-dd"),
          format(currentDate, "yyyy-MM-dd")
        ) && (
            <Box
              sx={{
                position: "absolute",
                right: 5,
                top: 5,
                bgcolor: "primary.main",
                borderRadius: "50%",
                width: 10,
                height: 10,
              }}
            ></Box>
          )}
      </ButtonBase>
    )
  );
};

const Cell = ({
  day,
  row,
  firstDay,
  month,
  currentDay,
  date,
  onSelect,
  selectedDate,
}) => {
  const numberDay = React.useMemo(() => day + 1 + row * 7, [day, row]);

  const isInMonth = React.useMemo(
    () => firstDay < numberDay && numberDay <= getMonthCount(month),
    [firstDay, numberDay, month]
  );

  return (
    <CellDaySection
      {...{
        currentDay,
        weekDay: day,
        date,
        day: numberDay,
        onSelect,
        selectedDate,
        isInMonth,
      }}
    >
      {isInMonth && (
        <>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "light",
              ...(day === 6 && { color: holidayColor }),
            }}
          >
            {digitsEnToFa(numberDay - firstDay)}
          </Typography>
          <Box
            sx={{
              display: "flex",
              color: "primary.dark",
              mt: 1,
              width: 1 / 1,
              justifyContent: "space-between",
            }}
          >
            <Typography>۱۴</Typography>
            <Typography>21</Typography>
          </Box>
        </>
      )}
    </CellDaySection>
  );
};

export const MonthSection = ({
  date,
  onSelect,
  display = "month",
  monthIndex = null,
  year = "1403",
  selectedDate,
}) => {
  const [month, setMonth] = React.useState(null);
  const [firstDay, setFirstDay] = React.useState(null);
  const [currentDay, setCurrentDay] = React.useState(null);
  const [currentDate, setCurrentDate] = React.useState(null);

  React.useEffect(() => {
    if (!!date) {
      if (!!monthIndex) {
        const dateString = `${year}-${monthIndex < 10 ? `0${monthIndex}` : monthIndex
          }-01`;

        const dateObj = parse(dateString, "yyyy-MM-dd", new Date());
        setMonth(monthIndex);
        setCurrentDay(getDate(dateObj));
        setFirstDay(
          jalaliWeekDayIndex[getDay(addDays(dateObj, -(getDate(dateObj) - 1)))]
        );
        setCurrentDate(dateObj);
      } else {
        setMonth(getMonth(date) + 1);
        setCurrentDay(getDate(date));
        setFirstDay(
          jalaliWeekDayIndex[getDay(addDays(date, -(getDate(date) - 1)))]
        );
        setCurrentDate(date);
      }
    }
  }, [date, monthIndex, year]);

  const { get } = useTranslate("Scheduler");

  return (
    !!currentDate && (
      <Box
        sx={{
          display: "flex",
          minHeight: 300,
          flexDirection: "column",
          m: 1,
          bgcolor: "background.default",
          overflow: "hidden",
        }}
      >
        {display === "month" && (
          <Box
            sx={{
              flexBasis: 50,

              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">{format(currentDate, "MMMM")}</Typography>
          </Box>
        )}
        <Box
          sx={{
            flexBasis: 50,
            display: "flex",
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

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {_.map(_.range(0, 5), (row) => (
            <Box
              key={row}
              sx={{
                display: "flex",
                flex: 1,

                ...(display === "month" && { minHeight: 100 }),
              }}
            >
              {_.map(_.range(0, 7), (day) => (
                <Cell
                  {...{
                    day,
                    row,
                    date: currentDate,
                    firstDay,
                    month,
                    currentDay,
                    onSelect,
                    selectedDate,
                  }}
                  key={day}
                />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    )
  );
};
