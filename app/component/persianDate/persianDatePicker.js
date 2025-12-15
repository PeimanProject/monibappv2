"use client";

import { Box } from "@mui/material";
import React from "react";
import { MonthSection } from "./monthSection";

export const PersianDatePicker = ({ onSelect, date }) => {
  const [currentDate, setDate] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(null);

  React.useEffect(() => {
    setDate(new Date().toISOString().substring(0, 10));
    // setSelectedDate(new Date().toISOString().substring(0, 10));
  }, []);

  // const handleChangeMonth = React.useCallback(
  //   (month) => () => {
  //     setDate(addMonths(currentDate, month).toISOString().substring(0, 10));
  //   },
  //   [currentDate]
  // );

  const handleSelect = React.useCallback(
    (date) => () => {
      setSelectedDate(date);
      onSelect && onSelect(date);
    },
    [onSelect]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: 300,
        flex: 1,
        py: 1,
      }}
    >
      {/* <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {currentDate && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton onClick={handleChangeMonth(-1)}>
              <RightIcon />
            </IconButton>
            <Typography sx={{ mx: 2 }}>
              {format(currentDate, "MMMM yyyy")}
            </Typography>
            <IconButton onClick={handleChangeMonth(1)}>
              <LeftIcon />
            </IconButton>
          </Box>
        )}
      </Box> */}

      <MonthSection
        date={currentDate}
        selectedDate={selectedDate}
        onSelect={handleSelect}
      />
    </Box>
  );
};
