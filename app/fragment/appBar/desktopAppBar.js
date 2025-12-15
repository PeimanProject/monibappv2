"use client";

import { SvgSearchIcon } from "@/app/assets/icons/searchIcon";
import { SvgUserIcon } from "@/app/assets/icons/userIcon";
import {
  AppBar,
  Container,
  IconButton,
  Toolbar,
  Box,
  InputBase,
  useTheme,
  Typography,
  Divider,
  Modal,
  Button,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useNavBarStore } from "@/store/layout/useNavBarStore";
import {
  useAuthLoginStore,
  useProfileStore,
} from "@/store/layout/useProfileStore";
import { useUserStore } from "@/store/useUserStore";
import { useSpring, animated } from "@react-spring/web";

export const DesktopAppBar = () => {
  const router = useRouter();
  const t = useTranslations("Common");
  const theme = useTheme();
  const locale = useLocale();
  const { navBar } = useNavBarStore();
  const setShowLogin = useAuthLoginStore((state) => state.setShow);
  const setShowProfile = useProfileStore((state) => state.setShow);
  const user = useUserStore((state) => state.user);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [show, setShow] = React.useState(true);
  const pathname = usePathname();

  React.useEffect(() => {
    const pattern = /^\/fa\/?$/;

    // const pattern = /\/player\//;
    setShow(!!!pattern.test(pathname));
  }, [pathname]);

  const handleToggleLogin = React.useCallback(
    (show) => () => {
      if (!!!user) {
        setShowLogin(show);
        return;
      }
      setShowProfile(show);
    },
    [user, setShowLogin, setShowProfile]
  );

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchValue("");
    }
  };

  const searchAnimation = useSpring({
    width: isSearchOpen ? 300 : 0,
    opacity: isSearchOpen ? 1 : 0,
    config: { tension: 300, friction: 30 },
  });

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      // Handle search submission here
      router.push(`/${locale}/search?q=${searchValue}`);
      // You can navigate to search page or trigger search
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          zIndex: (theme) => (isSearchOpen ? theme.zIndex.modal + 1 : 1),
        }}
      >
        <Container disableGutters>
          <Toolbar>
            <Link href={`/${locale}/`}>
              <Image
                src={`/icons/${theme.palette.mode}/monib-text.svg`}
                alt="Monib Text"
                width={100}
                height={30}
              />
            </Link>
            <Typography sx={{ fontWeight:"bold" }}>آزمایشی</Typography>
            <Box>
              {navBar?.title && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    a: {
                      textDecoration: "none",
                      color: "black",
                    },
                  }}
                >
                  <Link href={`/${locale}/`}>
                    <Typography variant="body2">صفحه نخست</Typography>
                  </Link>
                  {navBar?.links?.map((link, index) => (
                    <React.Fragment key={index}>
                      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                      <Link href={`/${locale}/${link.href}`}>
                        <Typography variant="body2">{link.title}</Typography>
                      </Link>
                    </React.Fragment>
                  ))}
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  <Typography variant="body2">{navBar?.title}</Typography>
                </Box>
              )}
            </Box>
          
            <Box sx={{ flex: 1 }} />
            {!show && (
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
                  px: 1,
                  mx: 1,
                }}
              >
                {t("GoToLastVersion")}
              </Button>
            )}
            {/* Animated Search Input */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mr: 1,
              }}
            >
              <animated.div style={searchAnimation}>
                <Box
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 4,
                    px: 2,
                    py: 0.5,
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "background.paper",
                    overflow: "hidden",
                    minWidth: 0,
                  }}
                >
                  <InputBase
                    sx={{
                      flex: 1,
                      zIndex: 1000,
                      "& ::placeholder": {
                        color: "text.secondary",
                        opacity: 1,
                      },
                    }}
                    placeholder={t("search")}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    autoFocus={isSearchOpen}
                  />
                </Box>
              </animated.div>
            </Box>

            <IconButton onClick={handleSearchToggle}>
              <SvgSearchIcon />
            </IconButton>
            <IconButton onClick={handleToggleLogin(true)}>
              <SvgUserIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Modal
        open={isSearchOpen}
        onClose={handleSearchToggle}
        sx={{
          "& .MuiBackdrop-root": {
            background: "transparent",
          },
          background: "transparent",
        }}
      >
        <div>
          <Typography></Typography>
        </div>
      </Modal>
    </>
  );
};
