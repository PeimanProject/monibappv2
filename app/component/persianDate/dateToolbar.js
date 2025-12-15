import React from "react";
import {
  alpha,
  Box,
  Button,
  Divider,
  Typography,
  styled,
  Menu,
} from "@mui/material";
import { desktopValues } from "@/core/config/values";
import _ from "lodash";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import DownIcon from "@mui/icons-material/KeyboardArrowDown";
import { SvgCalendarIcon } from "@/app/assets/icons/calendarIcon";
import Link from "next/link";
import { useEventCalendarStore } from "@/store/useEventCalendar";
import { format } from "date-fns-jalali";
import { useTranslate } from "@/core/useTranslation";

const CustomStyledMenu = styled(
  ({
    horizontal = "right",
    vertical = "bottom",
    verticalOrigin = "top",
    horizontalOrigin = "right",
    ...props
  }) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical,
        horizontal,
      }}
      transformOrigin={{
        vertical: verticalOrigin,
        horizontal: horizontalOrigin,
      }}
      {...props}
    />
  )
)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1, 2),
    minWidth: 120,
    backgroundColor: alpha(theme.palette.primary.main, 0.92),
    marginTop: 0,
    backdropFilter: "blur(3px)",
    boxShadow: theme.shadows[5],
  },
}));

const CustomStyledEventMenu = styled(
  ({
    horizontal = "right",
    vertical = "bottom",
    verticalOrigin = "top",
    horizontalOrigin = "right",
    ...props
  }) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical,
        horizontal,
      }}
      transformOrigin={{
        vertical: verticalOrigin,
        horizontal: horizontalOrigin,
      }}
      {...props}
    />
  )
)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(0.5),
    minWidth: 120,
    backgroundColor: alpha(theme.palette.background.paper, 0.92),
    marginTop: 2,
    backdropFilter: "blur(3px)",
    boxShadow: theme.shadows[5],
  },
}));

const Events = (current_tag) => [
  { title: "noEvent", data: null, scroll: current_tag },
  { title: "moharam", data: ({ month }) => month === 1, scroll: "day-1-1" },
  { title: "safar", data: ({ month }) => month === 2, scroll: "day-1-2" },
  {
    title: "fatemiyeh",
    data: ({ month, day }) =>
      (month === 5 && day >= 13 && day <= 15) ||
      (month === 6 && day >= 1 && day <= 3),
    scroll: "day-13-5",
  },
  { title: "ramadan", data: ({ month }) => month === 9, scroll: "day-1-9" },
  {
    title: "gadir",
    data: ({ month, day }) => month === 12 && day === 18,
    scroll: "day-18-12",
  },
  { title: "rajab", data: ({ month }) => month === 7, scroll: "day-1-7" },
  { title: "shaban", data: ({ month }) => month === 8, scroll: "day-1-8" },
];

export const DateToolbar = ({ year, desktop }) => {
  const [openYear, setOpenYear] = React.useState(false);
  const [openEvent, setOpenEvent] = React.useState(false);
  const { get } = useTranslate()
  const anchorYearRef = React.useRef(null);
  const anchorEventRef = React.useRef(null);
  const { event, setEvent } = useEventCalendarStore();

  const handleYearClose = React.useCallback((event) => {
    if (anchorYearRef.current && anchorYearRef.current.contains(event.target)) {
      return;
    }
    setOpenYear(false);
  }, []);

  const handleEvenClose = React.useCallback((event) => {
    if (anchorYearRef.current && anchorYearRef.current.contains(event.target)) {
      return;
    }
    setOpenEvent(false);
  }, []);

  const handleToggle = React.useCallback(
    () => setOpenYear((prevOpen) => !prevOpen),
    []
  );

  const handleToggleEvent = React.useCallback(
    () => setOpenEvent((prevOpen) => !prevOpen),
    []
  );

  const handleSelectEvent = React.useCallback(
    (e) => () => {
      setEvent(e);
      setOpenEvent(false);
    },
    [setEvent]
  );

  return (
    <>
      <CustomStyledMenu
        onClose={handleYearClose}
        open={openYear}
        anchorEl={anchorYearRef.current}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            width: 220,
            justifyContent: "center",
            alignItems: "center",
            a: {
              color: "text.primary",
            },
          }}
        >
          {_.map(_.range(1404, 1392), (y) => (
            <Link key={y} href={`/calendar/${y}`}>
              <Button
                variant={+year === y ? "contained" : "text"}
                sx={{ flexBasis: 50 }}
                color="inherit"
              >
                {digitsEnToFa(y)}
              </Button>
            </Link>
          ))}
        </Box>
      </CustomStyledMenu>

      <CustomStyledEventMenu
        onClose={handleEvenClose}
        open={openEvent}
        anchorEl={anchorEventRef.current}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minWidth: 114,
            justifyContent: "center",
            alignItems: "center",
            a: {
              color: "text.primary",
            },
          }}
        >
          {_.map(
            Events(`s-${format(new Date(), "yyyy-MM-dd")}`),
            (e, index) => (
              <Button
                key={index}
                variant={e.title === event?.title ? "contained" : "text"}
                onClick={handleSelectEvent(e)}
                color={e.title === event?.title ? "primary" : "inherit"}
                fullWidth
              >
                {get(`Lecture.${e.title}`)}
              </Button>
            )
          )}
        </Box>
      </CustomStyledEventMenu>

      <Box
        sx={{
          height: desktopValues({}).CALENDAR_Tools_HEIGHT,
          position: "sticky",
          bgcolor: "background.default",
          top: desktop ? 64 : desktopValues({}).APP_HEIGHT,
          zIndex: 9999,
          px: 2,
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            px: 1,
          }}
        >
          <Typography variant="caption">{get("Lecture.SessionSchedule")}</Typography>
          <Button
            endIcon={<DownIcon />}
            color="inherit"
            sx={{ fontWeight: "bold" }}
            onClick={handleToggle}
            ref={anchorYearRef}
          >
            {digitsEnToFa(year)}
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="contained"
            ref={anchorEventRef}
            sx={{
              bgcolor:
                !!event?.title && event?.title !== "noEvent"
                  ? "var(--event-color)"
                  : "primary.dark",
              color: "white",
            }}
            onClick={handleToggleEvent}
            endIcon={<SvgCalendarIcon color="#fff" />}
          >
            {!!event?.title && event?.title !== "noEvent"
              ? get(`Lecture.${event?.title}`)
              : get("Lecture.event")}
          </Button>
        </Box>
        <Divider sx={{ borderColor: "primary.main" }} />
      </Box>
    </>
  );
};
