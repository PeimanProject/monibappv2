"use client";

import { Box, Button, ButtonBase, useTheme } from "@mui/material";
import React from "react";
import { useSpring, animated } from "@react-spring/web";

export const TabNormalItem = ({
  text,
  onChange,
  index,
  value,
  selected,
  wSize = 100,
}) => {
  return (
    <Button
      onClick={onChange(value, index)}
      sx={{
        width: wSize,
        color: "text.primary",
        zIndex: 2,
        position: "relative",
        bgcolor: "transparent",
        borderRadius: 3,
        ...(!!selected && {
          color: "white",
        }),
        ...(!selected && {
          bgcolor: "grey.300",
        }),
      }}
    >
      {text}
    </Button>
  );
};

export const TabCircleItem = ({
  children,
  onChange,
  index,
  value,
  disabled,
}) => {
  return (
    <ButtonBase
      disabled={disabled}
      onClick={onChange(value, index)}
      sx={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        position: "relative",
        bgcolor: "transparent",
        color: "text.primary",
        flexDirection: "column",
        ...(disabled && {
          opacity: 0.2,
          cursor: "not-allowed",
        }),
      }}
    >
      {children}
    </ButtonBase>
  );
};

export const TabStyle = ({
  style = "normal",
  children,
  index,
  size = 44,
  wSize = 100,
}) => {
  const springs = useSpring({
    right: index * (style === "circle" ? size : wSize) + 4 + (index * 8),
  });

  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "grey.800" : "grey.200",
        p: 0.5,
        color: "text.primary",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        ...(style === "normal" && {
          borderRadius: 4,
        }),
        ...(style === "circle" && {
          borderRadius: 16,
        }),
      }}
    >
      <animated.div
        style={{
          position: "absolute",
          zIndex: 0,
          ...(style === "normal" && {
            borderRadius: 3 * 4,
            color: theme.palette.text.primary,
            background:
              theme.palette.mode === "dark" ? theme.palette.grey[600] : "black",
            width: wSize,
            height: 36,
          }),
          ...(style === "circle" && {
            borderRadius: "50%",
            color: theme.palette.text.primary,
            background: theme.palette.primary.main,
            width: size,
            height: size,
          }),

          ...springs,
        }}
      />

      {children}
    </Box>
  );
};
