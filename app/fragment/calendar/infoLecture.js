import React from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { BoxLoading } from "@/app/component/boxLoading";
import {
  AppBar,
  Box,
  Typography,
  ButtonBase,
  IconButton,
  Divider,
} from "@mui/material";
import _ from "lodash";
import { format } from "date-fns-jalali";
import { digitsEnToFa, numberToWords } from "@persian-tools/persian-tools";
import { useSpring, animated, config } from "@react-spring/web";
import * as d3 from "d3";
import { Close } from "@mui/icons-material";

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

export const InfoData = ({ lectures, selectedDate, hijri_month }) => {
  const t = useTranslations("Lecture");
  const locale = useLocale();

  const renderLecture = (lec) => {
    return (
      <ButtonBase
        sx={{
          // bgcolor: "#c7d4ce",
          color: "white",

          width: 1 / 1,
          borderRadius: 4,
          py: 1.2,
          minHeight: 44,
          px: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography>{lec?.contextName}</Typography>

          <Typography sx={{ mx: 1 }} variant="caption">
            {t("lecture")}
          </Typography>
          <Typography variant="caption">
            {numberToWords(lec.rowNumber, { ordinal: true })}
          </Typography>
          {lec?.series_note && <Typography  variant="caption" sx={{ ml: 1, color: "#f7f700" }}>({lec?.series_note})</Typography>}
        </Box>
        <Box sx={{ flex: 1 }} />
        {lec.file_type && (
          <Image
            src={`/icons/dark/play.svg`}
            width={24}
            height={24}
            alt="Play Icon"
          />
        )}
      </ButtonBase>
    );
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", px: 4 }}>
        <Typography sx={{ mb: 1, px: 1 }}>
          {digitsEnToFa(format(selectedDate.currentDate, "EEE d MMMM yyyy"))}
        </Typography>

        <Box sx={{ flex: 1 }} />
        <Typography sx={{ mb: 1, px: 1 }}>
          {`${digitsEnToFa(selectedDate.numberHijri)} ${digitsEnToFa(
            hijri_month[selectedDate.hijri_month - 1]
          )}`}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
      {_.map(lectures, (lec, index) => (
        <Box key={index}>
          {lec.file_type ? (
            <Link href={`/${locale}/player/${lec.id}`}>
              {renderLecture(lec)}
            </Link>
          ) : (
            renderLecture(lec)
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 0.5,
              color: "text.secondary",
            }}
          >
            <Typography sx={{ px: 1 }}>{lec?.location}</Typography>
            <Typography sx={{ mr: 0.5 }}>
              ساعت:
              {digitsEnToFa(lec?.time?.slice(11, 16))}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ px: 1, color: "text.secondary" }}>
            {lec?.location_address}
          </Typography>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
        </Box>
      ))}
    </>
  );
};

export const InfoLecture = ({
  show,
  loading,
  lectures,
  selectedDate,
  onClose,
  hijri_month,
}) => {
  const t = useTranslations("Lecture");
  const locale = useLocale();

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        color="transparent"
        sx={{
          top: "auto",
          bottom: 0,
          zIndex: (theme) => theme.zIndex.appBar - 1,
        }}
      >
        <Back show={show}>
          {!!show && (
            <IconButton
              sx={{ position: "absolute", left: 10, top: 5 }}
              onClick={onClose}
            >
              <Close />
            </IconButton>
          )}
          <Box
            sx={{
              height: 0,
              position: "absolute",
              left: 25,
              pb: 12,
              top: 50,
              width: "calc(100% - 50px)",
              color: "white",
            }}
          >
            {!!loading && <BoxLoading />}
            {!!lectures && (
              <InfoData {...{ lectures, selectedDate, hijri_month }} />
            )}
          </Box>
        </Back>
      </AppBar>
    </>
  );
};
