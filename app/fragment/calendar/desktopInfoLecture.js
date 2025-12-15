import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
} from "@mui/material";
import _ from "lodash";
import { useSpring, animated, config } from "@react-spring/web";
import * as d3 from "d3";
import { InfoData } from "./infoLecture";

const h = 140;
const hB = 400;

const SVG = ({ showMenu }) => {
  const svgRef = React.useRef();
  const [curve, setCurve] = React.useState(60);

  React.useEffect(() => {
    setCurve(showMenu ? 0 : 60);
  }, [showMenu]);

  React.useEffect(() => {
    const width = window.innerWidth;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", hB);

    const pathData = `M 0,${curve}
                      Q ${width / 2},${0} ${width},${curve}
                      V ${hB}
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
      .attr("fill", "#6a8a7e")
      .attr("stroke", "null")
      .attr("stroke-width", 0);
  }, [showMenu, curve]);

  return <Box component={"svg"} ref={svgRef} />;
};

const Back = ({ children, show }) => {
  const springs = useSpring({
    ...(!!!show && {
      height: h,
    }),
    ...(!!show && {
      height: hB,
    }),
    delay: !!!show ? 200 : 0,
    config: !!!show ? config.stiff : config.default,
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
      <SVG showMenu={show} />
      {children}
    </animated.div>
  );
};

export const DesktopInfoLecture = ({
  show,
  loading,
  lectures,
  selectedDate,
  onClose,
  hijri_month,
}) => {

  return (
    <>
      <Dialog maxWidth="sm" fullWidth open={show} onClose={onClose}>
        <DialogContent>
          <Box sx={{ p: 4 }}>
            <InfoData {...{ lectures, selectedDate, hijri_month }} />

          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
