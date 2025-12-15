"use client";

import React from "react";
import { animated } from "@react-spring/web";
import _ from "lodash";
import { Box, useTheme } from "@mui/material";
import { useTranslate } from "@/core/useTranslation";

export const MenuContainer = ({ item, onChange, style, onClose }) => {
  const { get } = useTranslate()
  const theme = useTheme();

  return (
    <animated.div style={{ ...style, transformOrigin: "center center" }}>
      <Box
        sx={{
          width: 1 / 1,
        }}
      >
        <Box
          sx={{
            minHeight: 30,
            my: 1.4,
            display: "flex",
            alignItems: "center",
          }}
        >
          {_.isFunction(item.render) &&
            item.render({ get, onChange, mode: theme.palette.mode, onClose })}
        </Box>
      </Box>
    </animated.div>
  );
};
