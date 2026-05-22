"use client";
import React from "react";
import { Box } from "@mui/material";
import { MobileSpringSlider } from "./SpringSlider";

export const MobileSlider = ({ list, ...props }) => {
  return (
    <Box
      className="mobile-home-slider"
      sx={{
        display: "block",
        boxSizing: "border-box",
        px: 1,
        py: 0,
        m: 0,
        lineHeight: 0,
        fontSize: 0,
      }}
    >
      <MobileSpringSlider list={list} {...props} />
    </Box>
  );
};
