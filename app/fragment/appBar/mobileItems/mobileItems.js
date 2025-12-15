"use client";

import { useMainMenuStore } from "@/store/layout/useLayoutStore";
import { Box, Fab, Toolbar } from "@mui/material";
import {
  useSpringRef,
  useTransition,
  animated,
  useChain,
  useSpring,
  config,
} from "@react-spring/web";
import React from "react";
import _ from "lodash";
import { useTranslations } from "next-intl";
import { mainMenuData } from "./mobileItemData";
import BackIcon from "@mui/icons-material/ArrowForwardIos";
import { MenuContainer } from "./menuContainer";
import { SettingData } from "./mobileItemSettingData";

const Block = ({ show, data, onChange, onClose }) => {
  const transApi = useSpringRef();
  const transition = useTransition(show ? data : [], {
    ref: transApi,
    trail: 400 / data.length,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
  });

  useChain(show ? [transApi] : [transApi], [0, show ? 0.1 : 0.6]);

  return (
    <>
      {transition((style, item) => (
        <MenuContainer key={item.id} {...{ style, item, onChange, onClose }} />
      ))}
    </>
  );
};

const SubData = {
  main: [],
  setting: SettingData,
};

export const MobileItems = () => {
  const show = useMainMenuStore((state) => state.show);
  const setShow = useMainMenuStore((state) => state.setShow);

  const t = useTranslations("Menu");
  const [state, setState] = React.useState("main");

  const handelClose = () => setShow(false);

  // React.useEffect(() => setState("main"), [show]);

  const handleChangeState = React.useCallback(
    (state) => () => setState(state),
    []
  );

  const springs = useSpring({
    right: state === "main" ? "0%" : "-110%",
  });

  const springsSub = useSpring({
    left: state === "main" || !!!show ? "-110%" : "0",
  });

  const springsBack = useSpring({
    ...((state === "main" || !!!show) && {
      right: 0,
      scale: 0,
    }),

    ...(state !== "main" &&
      !!show && {
        right: 0,
        scale: 1,
      }),
    delay: state === "main" ? 0 : 0,
    config: config.default,
  });

  return (
    <Box
      sx={{
        minHeight: "calc(100% - 140px)",
        width: "calc(100% - 40px)",
        position: "absolute",
        top: 42,
        left: 20,
      }}
    >
      <Toolbar sx={{ overflow: "hidden" }}>
        <animated.div
          style={{
            position: "absolute",
            transformOrigin: "center center",
            ...springsBack,
          }}
        >
          <Fab onClick={handleChangeState("main")}>
            <BackIcon />
          </Fab>
        </animated.div>
      </Toolbar>
      <animated.div
        style={{
          position: "absolute",
          width: "100%",
          top: 64,
          ...springsSub,
        }}
      >
        <Block
          {...{
            data: SubData[state],
            onChange: handleChangeState,
            show,
          }}
        />
      </animated.div>
      <animated.div
        style={{
          position: "absolute",
          width: "100%",
          top: 64,
          ...springs,
        }}
      >
        <Block
          {...{
            data: mainMenuData,
            onChange: handleChangeState,
            onClose: handelClose,
            show,
          }}
        />
      </animated.div>
    </Box>
  );
};
