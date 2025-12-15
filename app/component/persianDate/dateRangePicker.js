"use client";

import { SvgDateRangeIcon } from "@/app/assets/icons/dateRangeIcon";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import Menu from "@mui/material/Menu";
import { PersianDatePicker } from "./persianDatePicker";
import { formatDate } from "@/utils/format.date";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useTranslations } from "next-intl";
import { Clear } from "@mui/icons-material";

export const CustomStyledMenu = styled(
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
  ),
  {}
)(({ theme }) => ({
  "& .MuiMenu-list": {
    padding: theme.spacing(0),
    border: `1px solid ${theme.palette.primary.main}`,
  },
  "& .MuiPaper-root": {
    borderRadius: theme.spacing(0),
    padding: theme.spacing(0),
    minWidth: 220,
    marginTop: 5,
    backgroundColor: theme.palette.background.paper,
    // border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: theme.shadows[20],
  },
}));

export const DateRangePicker = ({
  action,
  onClear,
  dateRange,
  onSelect,
  orientation = "horizontal",
  formatStr = "EEE d MMMM yyyy",
}) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const t = useTranslations("Date");

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleToggle = React.useCallback(
    () => setOpen((prevOpen) => !prevOpen),
    []
  );

  return (
    <>
      <Box
        sx={{
          bgcolor: "grey.200",
          boxShadow: 1,
          minWidth: 50,
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Button onClick={handleToggle} ref={anchorRef}>
          <SvgDateRangeIcon />
        </Button>
        {(!!dateRange?.start || !!dateRange?.end) && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pl: 2,
              pr: 1,
              flex: 1,
              bgcolor: "background.paper",
              ...(orientation === "vertical" && {
                flexDirection: "column",
              }),
              borderRadius: 5,
              py: 0.5,
              border: 1,
              borderColor: "divider",
              color: "primary.dark",
            }}
          >
            {!!dateRange?.start && (
              <>
                <Typography variant="caption">
                  {digitsEnToFa(
                    formatDate({
                      date: dateRange?.start,
                      formatStr,
                    })
                  )}
                </Typography>
              </>
            )}
            {!!dateRange?.end && (
              <>
                <Typography sx={{ mx: 2 }}>{t("to")}</Typography>
                <Typography variant="caption">
                  {digitsEnToFa(
                    formatDate({
                      date: dateRange?.end,
                      formatStr,
                    })
                  )}
                </Typography>
              </>
            )}
            <IconButton size="small" onClick={onClear} sx={{ mx: 1 }}>
              <Clear />
            </IconButton>
            {action}
          </Box>
        )}
      </Box>
      <CustomStyledMenu
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
      >
        <Box sx={{ display: "flex", height: 1 / 1, alignItems: "center" }}>
          <PersianDatePicker onSelect={onSelect("start")} />
          <Divider orientation="vertical" sx={{ mx: 1, minHeight: 380 }} />
          <PersianDatePicker onSelect={onSelect("end")} />
        </Box>
      </CustomStyledMenu>
    </>
  );
};
