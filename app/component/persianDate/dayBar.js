import { Box, Typography, ButtonBase } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";
import {
  getMonth,
  getDate,
  format,
  addDays,
  getDay,
  isEqual,
} from "date-fns-jalali";
import _ from "lodash";
import CheckIcon from "@mui/icons-material/Check";

export const holidayColor = red[400];

export const weekDays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const jalaliWeekDay = [6, 0, 1, 2, 3, 4, 5];
export const jalaliWeekDayIndex = [1, 2, 3, 4, 5, 6, 0];

export const getMonthCount = (month, leap) => {
  if (month <= 6) {
    return 31;
  } else if (month <= 11) {
    return 30;
  } else if (month === 12) {
    return !!leap ? 30 : 29;
  }

  return 29;
};

const DaySection = ({
  day,
  date,
  currentDay,
  selectedDate,
  onSelect,
  list,
}) => {
  const [currentDate, setCurrentDate] = React.useState(null);
  const [archiveData, setArchiveData] = React.useState(null);

  React.useEffect(() => {
    setCurrentDate(addDays(date, day - currentDay));
  }, [day, date, currentDay]);

  React.useEffect(() => {
    if (!!list && !!currentDate) {
      setArchiveData(
        _.find(list, (v) =>
          isEqual(
            format(currentDate, "yyyy-MM-dd"),
            format(v.dateId, "yyyy-MM-dd")
          )
        )
      );
    }
  }, [list, currentDate]);

  return (
    currentDate && (
      <Box
        sx={{
          display: "flex",
          px: 0.5,
          flex: 1,
          position: "relative",
        }}
      >
        {!!archiveData && (
          <Box
            sx={{
              position: "absolute",
              top: 5,
              left: "50%",
              transform: "translate(-50%,0)",
              zIndex: 1,
            }}
          >
            <CheckIcon fontSize="small" color="primary" />
          </Box>
        )}
        <ButtonBase
          onClick={onSelect(currentDate)}
          sx={{
            width: 1 / 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            ...(isEqual(
              format(new Date(), "yyyy-MM-dd"),
              format(currentDate, "yyyy-MM-dd")
            ) && {
              borderColor: "grey.200",
              bgcolor: "grey.100",
            }),
            ...(isEqual(
              format(selectedDate, "yyyy-MM-dd"),
              format(currentDate, "yyyy-MM-dd")
            ) && {
              background: (theme) =>
                `linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: "white",
              boxShadow: 0,
              my: 0.5,
              borderRadius: 3,
              zIndex: 9,
            }),
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              mb: 2,
              fontSize: 9,
              ...(currentDay <= day && {
                color: "text.primary",
                opacity: 1,
              }),
              ...(getDay(currentDate) === 5 && { color: "red" }),
              ...(isEqual(
                format(selectedDate, "yyyy-MM-dd"),
                format(currentDate, "yyyy-MM-dd")
              ) && {
                color: "white",
              }),
            }}
          >
            {format(currentDate, "EEEE")}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              ...(currentDay <= day && {
                fontWeight: "bold",
                color: "text.primary",
              }),
              ...(getDay(currentDate) === 5 && {
                color: red[500],
              }),
              ...(isEqual(
                format(selectedDate, "yyyy-MM-dd"),
                format(currentDate, "yyyy-MM-dd")
              ) && {
                color: "white",
              }),
            }}
          >
            {day}
          </Typography>
        </ButtonBase>
      </Box>
    )
  );
};

export const DayBar = ({ date, selectedDate, onSelect, list }) => {
  const [month, setMonth] = React.useState(null);
  const [currentDay, setCurrentDay] = React.useState(null);

  React.useEffect(() => {
    if (!!date) {
      setMonth(getMonth(date) + 1);
      setCurrentDay(getDate(date));
    }
  }, [date]);

  return (
    <Box
      sx={{
        flexBasis: 120,
        borderBottom: 1,
        borderColor: "grey.300",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {!!month &&
        _.map(_.range(1, getMonthCount(month) + 1), (day) => {
          return (
            <DaySection
              currentDay={currentDay}
              day={day}
              key={day}
              date={date}
              onSelect={onSelect}
              list={list}
              selectedDate={selectedDate}
            />
          );
        })}
    </Box>
  );
};
