"use client";

import { Box, useTheme, alpha } from "@mui/material";
import React from "react";
import * as d3 from "d3";
import { useMainMenuStore } from "@/store/layout/useLayoutStore";
import { useSpring, animated, config } from "@react-spring/web";

const NAV_VISUAL_HEIGHT = 140;

const SVG = ({ showMenu, containerHeight }) => {
  const theme = useTheme();
  const svgRef = React.useRef();
  const [curve, setCurve] = React.useState(60);

  React.useEffect(() => {
    setCurve(showMenu ? 30 : 60);
  }, [showMenu]);

  React.useEffect(() => {
    if (!svgRef.current || containerHeight <= 0) return;

    const width = window.innerWidth;
    const height = containerHeight;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const pathData = `M 0,${curve}
                      Q ${width / 2},${0} ${width},${curve}
                      V ${height}
                      H 0
                      Z`;

    let path = svg.select("path");
    if (path.empty()) {
      path = svg.append("path");
    }

    path
      .transition()
      .duration(250)
      .attr("d", pathData)
      .attr(
        "fill",
        !!showMenu
          ? theme.palette.primary.dark
          : alpha(
              theme.palette.mode === "dark"
                ? theme.palette.primary.dark
                : theme.palette.primary.main,
              0.9
            )
      )
      .attr("stroke", "null")
      .attr("stroke-width", 0);
  }, [showMenu, curve, containerHeight, theme]);

  return <Box component={"svg"} ref={svgRef} sx={{ display: "block" }} />;
};

export const AppBarBack = ({ children }) => {
  const showMenu = useMainMenuStore((state) => state.show);

  const expandedHeight = React.useMemo(() => {
    if (typeof window === "undefined") return NAV_VISUAL_HEIGHT;
    return Math.max(NAV_VISUAL_HEIGHT, window.innerHeight - 20);
  }, [showMenu]);

  const springs = useSpring({
    height: showMenu ? expandedHeight : NAV_VISUAL_HEIGHT,
    delay: !showMenu ? 200 : 0,
    config: !showMenu ? config.stiff : config.default,
  });

  const containerHeight = showMenu ? expandedHeight : NAV_VISUAL_HEIGHT;

  return (
    <animated.div
      style={{
        position: "absolute",
        overflow: "hidden",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 1,
        filter: "drop-shadow(0 0px 6px rgba(0, 0, 0, 0.8))",
        ...springs,
      }}
    >
      <SVG showMenu={showMenu} containerHeight={containerHeight} />
      {children}
    </animated.div>
  );
};
