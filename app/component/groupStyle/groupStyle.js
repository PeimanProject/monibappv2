"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import _ from "lodash";
import { Box, ButtonBase, Typography, useTheme } from "@mui/material";

export const GroupStyle = ({
  list,
  style = "normal",
  value,
  onChange,
  name,
  elevation = 0,
}) => {
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(null);
  //   const [leftPosition, setLeftPosition] = useState(0);
  //   const [widthPosition, setWidthPosition] = useState(0);
  //   const [backgroundColor, setBackgroundColor] = useState("black");
  const buttonRefs = useRef([]);

  const [spring, api] = useSpring(() => ({
    left: 0,
    width: 0,
    backgroundColor: "black",
    config: { duration: 200 },
  }));

  useEffect(() => {
    const index = _.findIndex(list, { value });
    setSelectedIndex(index);

    if (index !== -1 && buttonRefs.current[index]) {
      const left = buttonRefs.current[index].offsetLeft;
      const width = buttonRefs.current[index].offsetWidth;
      const newBgColor =
        list[index]?.bgcolor ||
        (theme.palette.mode === "dark" ? theme.palette.grey[600] : "black");

      // Animate left first, then backgroundColor
      api.start({
        left,
        width,
        onRest: () => {
          api.start({ backgroundColor: newBgColor });
        },
      });
    }
  }, [value, list, theme.palette.mode, api]);

  const handleChange = React.useCallback(
    (value) => () =>
      _.isFunction(onChange) && onChange({ target: { name, value } }),
    [onChange]
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 0.5,
        borderRadius: 8,
        bgcolor: "background.paper",
        position: "relative",
        boxShadow: elevation,
      }}
    >
      <animated.div
        style={{
          position: "absolute",
          zIndex: 0,
          ...(style === "normal" && {
            borderRadius: 45,
            height: 38,
          }),
          ...spring,
        }}
      />

      {_.map(list, ({ title, width, value, fgcolor }, index) => (
        <ButtonBase
          onClick={handleChange(value)}
          sx={{
            width: width || "auto",
            borderRadius: 8,
            px: 2,
            height: 38,
            ...(selectedIndex === index && {
              color: fgcolor || "white",
            }),
          }}
          key={index}
          ref={(el) => (buttonRefs.current[index] = el)}
        >
          <Typography>{title}</Typography>
        </ButtonBase>
      ))}
    </Box>
  );
};
