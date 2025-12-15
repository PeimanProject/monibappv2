"use client";

import { Box } from "@mui/material";
import { format } from "date-fns-jalali";
import React from "react";

export const Timer = ({ time, pure = false }) => {
  const [current, setCurrent] = React.useState("");

  React.useEffect(() => {
    const timer = setInterval(() => {
      let [H, M, S] = time.split(/\W/);
      const base = +H * 60 * 60 + +M * 60 + +S;
      if (base > 0) {
        const d = format(new Date(), "HH:mm:ss");
        let [H, M, S] = d.split(/\W/);
        let ss = base - (+H * 60 * 60 + +M * 60 + +S);
        setCurrent(new Date(ss * 1000).toISOString().substring(11, 19));
      }
    }, [1000]);

    return () => clearInterval(timer);
  }, [time, setCurrent]);

  return (
    <Box
      sx={{
        fontSize: 12,
        bgcolor: "var(--live-color)",
        borderRadius: 5,
        color: "white",
        ...(!!!pure && {
          py: 0.5,
          px: 2,
        }),
      }}
    >
      {current}
    </Box>
  );
};
