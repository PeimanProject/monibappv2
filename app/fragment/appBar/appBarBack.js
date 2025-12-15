"use client";

import { Box, useTheme, alpha } from "@mui/material";
import React from "react";
import * as d3 from "d3";
import { useMainMenuStore } from "@/store/layout/useLayoutStore";
import { useSpring, animated, config } from "@react-spring/web";

const h = 140;

const SVG = ({ showMenu }) => {
  const theme = useTheme();
  const svgRef = React.useRef();
  const [curve, setCurve] = React.useState(60);

  React.useEffect(() => {
    setCurve(showMenu ? 30 : 60);
  }, [showMenu]);

  React.useEffect(() => {
    const width = window.innerWidth;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", window.innerHeight);

    const pathData = `M 0,${curve}
                      Q ${width / 2},${0} ${width},${curve}
                      V ${window.innerHeight}
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
  }, [showMenu, curve]);

  return <Box component={"svg"} ref={svgRef} />;
};

export const AppBarBack = ({ children }) => {
  const showMenu = useMainMenuStore((state) => state.show);

  const springs = useSpring({
    ...(!!!showMenu && {
      height: h,
    }),
    ...(!!showMenu && {
      height: window.innerHeight - 20,
    }),
    delay: !!!showMenu ? 200 : 0,
    config: !!!showMenu ? config.stiff : config.default,
  });

  return (
    <animated.div
      style={{
        position: "absolute",
        overflow: "hidden",
        bottom: 0,
        left: 0,
        width: "100%",
        filter: "drop-shadow(0 0px 6px rgba(0, 0, 0, 0.8))",
        // ...(showMenu && {
        //   backdropFilter: "blur(28px)",
        // }),
        ...springs,
      }}
    >
      <SVG showMenu={showMenu} />
      {children}
    </animated.div>
  );
};
