"use client";

import {
  AppBar,
  Box,
  Typography,
  alpha,
  useTheme,
  Divider,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import PropTypes from "prop-types";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { usePathname } from "next/navigation";
import { desktopValues } from "@/core/config/values";
import Link from "next/link";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useRouter } from "next/navigation";
import { useVerseDataStore } from "@/store/useVerseData";

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return children
    ? React.cloneElement(children, {
      isScroll: trigger ? true : false,
    })
    : null;
}


const Tools = ({ }) => {
  const pathname = usePathname();
  const [show, setShow] = React.useState(true);
  const router = useRouter();
  const theme = useTheme();
  const { title, subText, mode } = useVerseDataStore();

  // React.useEffect(() => {
  //   const pattern = /^\/fa\/?$/;

  //   // const pattern = /\/player\//;
  //   setShow(!!!pattern.test(pathname));
  // }, [pathname]);

  const handleBackClick = () => {
    router.back();
  };

  return (
    <AppBar
      elevation={0}
      position="sticky"
      sx={{
        background: (theme) => alpha(theme.palette.background.paper, 1),
        backdropFilter: "blur(5px)",
        ...(mode === "quran" && {
          background: "#bccac4",
        }),
        // ...(!!isScroll && {
        //   boxShadow: `0 0px 2px rgba(0, 0, 0, 0.8)`,
        // }),
        transition: (theme) => theme.transitions.create("all"),
      }}
      color="transparent"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: desktopValues({}).APP_HEIGHT,

          px: 2,
          ">a": {
            display: "flex",
            alignItems: "center",
            height: desktopValues({}).APP_HEIGHT,
          },
        }}
      >
        <Link href={`/`}>
          <Image
            src={`/icons/${theme.palette.mode}/monib-text.svg`}
            alt="Monib Text"
            width={100}
            height={30}
          />
        </Link>

        {!!title && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 0.5,
              a: {
                color: "text.primary",
              },
            }}
          >
            <Typography variant="caption">{title}</Typography>
            {!!subText && (
              <>
                <Divider
                  orientation="vertical"
                  sx={{ minHeight: 15, mx: 0.5, transform: "rotate(20deg)" }}
                />
                <Typography variant="caption">{subText}</Typography>
              </>
            )}
          </Box>
        )}

        <Box sx={{ flex: 1 }}>
          {show && (
            <Typography
              sx={{ color: "primary.main", fontWeight: "bold" }}
            >
              آزمایشی
            </Typography>
          )}
        </Box>
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            a: {
              textDecoration: "none",
            },
          }}
        >
          <Link href={`/${locale}/search`}>
            <>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  textDecoration: "none",
                }}
              >
                {t("search")}
              </Typography>

              <IconButton>
                <Image
                  alt="Search"
                  src={`/icons/${theme.palette.mode}/find.svg`}
                  width={20}
                  height={20}
                />
              </IconButton>
            </>
          </Link>
        </Box> */}
        {/* {show && (
          <IconButton sx={{ color: "text.primary" }} onClick={handleBackClick}>
            <ArrowBackIosIcon />
          </IconButton>
        )} */}
        {/* {!show && (
          <>
            <Button
              onClick={() => {
                window.open("https://old.monibapp.ir", "_blank");
              }}
              size="small"
              variant="contained"
              color="primary"
              sx={{
                textTransform: "none",
                bgcolor: "primary.dark",
                fontSize: "0.80rem",
                px: 0.7,
              }}
            >
              {t("GoToLastVersion")}
            </Button>
          </>
        )} */}
      </Box>
    </AppBar>
  );
};

export const MobileTopBar = (props) => {
  return (
    <ElevationScroll {...props}>
      <Tools />
    </ElevationScroll>
  );
};