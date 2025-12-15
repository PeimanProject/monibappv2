"use client";

import { AppBar, ButtonBase, Typography, useTheme } from "@mui/material";
import React from "react";
import { AppBarBack } from "./appBarBack";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useMainMenuStore } from "@/store/layout/useLayoutStore";
import { useSpring, animated } from "@react-spring/web";
import { MobileItems } from "./mobileItems/mobileItems";
import {
  useAuthLoginStore,
  useProfileStore,
} from "@/store/layout/useProfileStore";
import { usePlayListStore } from "@/store/usePlayListStore";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

const MainMenuKey = ({ pos = -40, top = 0, title, onClick, showMenu }) => {
  const theme = useTheme();

  const springs = useSpring({
    ...(!!!showMenu && {
      borderRadius: theme.spacing(2),
      background: "transparent",
    }),
    ...(!!showMenu && {
      borderRadius: theme.spacing(10),
      background: theme.palette.primary.main,
    }),
  });

  const springsPr = useSpring({
    ...(!!!showMenu && {
      bottom: top,
    }),
    ...(!!showMenu && {
      bottom: 15,
    }),
  });

  const springsMenuIcon = useSpring({
    ...(!!!showMenu && {
      top: 8,
    }),
    ...(!!showMenu && {
      top: 60,
    }),
    // delay: !!!showMenu ? 200 : 0,
  });

  const springsCloseIcon = useSpring({
    ...(!!!showMenu && {
      top: -60,
    }),
    ...(!!showMenu && {
      top: 10,
    }),
    // delay: showMenu ? 200 : 0,
  });

  return (
    <animated.div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "absolute",
        width: 80,
        height: 60 + 20,
        left: "50%",
        zIndex: 8,
        marginLeft: `${pos}px`,
        ...springsPr,
      }}
    >
      <animated.div
        style={{
          border: `2px solid ${
            theme.palette.mode === "dark"
              ? "var(--border-dark-color)"
              : theme.palette.divider
          }`,
          overflow: "hidden",
          ...springs,
        }}
      >
        <ButtonBase
          onClick={onClick}
          sx={{
            width: 46,
            height: 46,
            overflow: "hidden",
          }}
        >
          <animated.div
            style={{
              position: "absolute",
              ...springsMenuIcon,
            }}
          >
            <Image
              src={`/icons/${theme.palette.mode}/menu/menu.svg`}
              width={30}
              height={30}
              alt="Menu Icon"
            />
          </animated.div>
          <animated.div
            style={{
              position: "absolute",
              ...springsCloseIcon,
            }}
          >
            <Image
              src={`/icons/${theme.palette.mode}/menu/close.svg`}
              width={26}
              height={26}
              alt="Menu Icon"
            />
          </animated.div>
        </ButtonBase>
      </animated.div>
      <Typography variant="caption">{title}</Typography>
    </animated.div>
  );
};

const MenuKey = ({ icon, pos = -40, top = 0, title, onClick, showMenu }) => {
  const theme = useTheme();

  const springs = useSpring({
    ...(!!!showMenu && {
      borderRadius: theme.spacing(2),
      background: "transparent",
    }),
    ...(!!showMenu && {
      borderRadius: theme.spacing(10),
      background: theme.palette.primary.main,
    }),
  });

  const springsPr = useSpring({
    ...(!!!showMenu && {
      bottom: top,
      opacity: 1,
    }),
    ...(!!showMenu && {
      bottom: 15,
      opacity: 0,
    }),
  });

  return (
    <animated.div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "absolute",
        width: 70,
        height: 50 + 20,
        left: "50%",
        marginLeft: `${pos}px`,
        zIndex: 8,
        ...springsPr,
      }}
    >
      <animated.div
        style={{
          border: `2px solid ${
            theme.palette.mode === "dark"
              ? "var(--border-dark-color)"
              : theme.palette.divider
          }`,
          overflow: "hidden",
          ...springs,
        }}
      >
        <ButtonBase
          onClick={onClick}
          sx={{
            width: 38,
            height: 38,
          }}
        >
          <Image
            src={`/icons/${theme.palette.mode}/${icon}`}
            width={30}
            height={30}
            alt="Menu Icon"
          />
        </ButtonBase>
      </animated.div>
      <Typography variant="caption">{title}</Typography>
    </animated.div>
  );
};

const m = 18;
const topValue = 10;

export const MobileAppBar = () => {
  const user = useUserStore((state) => state.user);
  const setShowLogin = useAuthLoginStore((state) => state.setShow);
  const setShowProfile = useProfileStore((state) => state.setShow);
  const t = useTranslations("Menu");
  const { show, setShow } = useMainMenuStore((state) => state);
  const setShowPlayList = usePlayListStore((state) => state.setShow);
  const router = useRouter();
  const locale = useLocale();

  const [showButtons, setShowButtons] = React.useState(false);

  const handleMenuClick = React.useCallback(
    (show) => () => setShow(show),
    [setShow]
  );

  const handleToggleLogin = React.useCallback(
    (show) => () => {
      if (!!!user) {
        setShowLogin(show);
        return;
      }
      setShowProfile(show);
    },
    [setShow, user, setShowLogin, setShowProfile]
  );

  const handlePlayListClick = React.useCallback(
    (show) => () => {
      if (!!!user) {
        setShowLogin(true);
        return;
      }
      setShowPlayList(show);
    },
    [setShowPlayList, user, setShowLogin]
  );

  React.useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleHome = React.useCallback(
    () => router.push(`/${locale}/`),
    [router, locale]
  );

  const handleFind = React.useCallback(
    () => router.push(`/${locale}/search`),
    [router, locale]
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        color="transparent"
        sx={{
          top: "auto",
          bottom: 0,
          zIndex: (theme) => theme.zIndex.drawer + 10
        }}
      >
        <AppBarBack>
          {!!showButtons && (
            <>
              <MobileItems />
              <MenuKey
                icon={!!!user ? "/menu/user.svg" : "/menu/profile.svg"}
                pos={-35 - 55 - m * 2 - 50}
                top={22 - topValue}
                showMenu={show}
                onClick={handleToggleLogin(true)}
                title={t("profile")}
              />
              <MenuKey
                icon={"/menu/playlist.svg"}
                pos={-35 - 55 - m}
                top={16 + topValue}
                showMenu={show}
                title={t("playlist")}
                onClick={handlePlayListClick(true)}
              />
              <MainMenuKey
                onClick={handleMenuClick(!show)}
                top={34 - topValue}
                showMenu={show}
                title={t("menu")}
              />
              <MenuKey
                icon={"/menu/find.svg"}
                pos={20 + m}
                top={16 + topValue}
                showMenu={show}
                title={t("find")}
                onClick={handleFind}
              />

              <MenuKey
                icon={"/menu/home.svg"}
                onClick={handleHome}
                pos={20 + m * 2 + 50}
                top={22 - topValue}
                showMenu={show}
                title={t("home")}
              />
            </>
          )}
        </AppBarBack>
      </AppBar>
    </>
  );
};
