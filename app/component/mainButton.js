import { desktopValues } from "@/core/config/values";
import { ButtonBase, Typography, Box } from "@mui/material";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const MainButton = ({
  textIcon,
  title,
  info,
  fullWidth = false,
  bgcolor,
  text,
  icon,
  center = false,
  link,
  position = "center",
  children,
  back,
  onClick,
  border = false,
}) => {
  const locale = useLocale();
  

  const buttonContent = (
    <ButtonBase
      sx={{
        minWidth: 20,
        minHeight: 70,
        ...(!!!bgcolor && {
          boxShadow: 2,
        }),
        border: (theme) =>
          theme.palette.mode === "dark"
            ? `1px solid ${theme.palette.primary.dark}`
            : border ? 2 : 0,
        justifyContent: "center",
        position: "relative",
        borderRadius: desktopValues({}).BORDER,
        m: 0.3,
        ...(!!textIcon && {
          px: 6,
          alignItems: "center",
          justifyContent: !!center ? "center" : "flex-start",
        }),
        ...(!!fullWidth && {
          flex: 1,
          width: 1 / 1,
        }),
        ...(!!bgcolor && {
          bgcolor,
          borderColor: bgcolor,
          color: "white",
        }),
        ...(!!icon && { flexDirection: "column" }),
        ...(!!back && {
          backgroundImage: `url(/images/${back})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }),
      }}
      {...(onClick && { onClick })}
    >
      {!!textIcon && (
        <Image
          alt={title}
          src={textIcon}
          width={position === "bottom" ? 100 : 120}
          height={position === "bottom" ? 40 : 40}
        />
      )}
      {!!info && (
        <Box
          sx={{
            position: "absolute",
            ...(position === "center" && {
              right: 40,
              top: 20,
            }),
            ...(position === "bottom" && {
              left: "50%",
              bottom: -2,
              transform: "translate(-50%,0)",
            }),
          }}
        >
          <Typography sx={{ color: "primary.dark" }} variant="caption">
            {info}
          </Typography>
        </Box>
      )}
      {!!text && !!!icon && !!!children && (
        <Typography sx={{ fontWeight: "bold" }}>{text}</Typography>
      )}
      {!!icon && <Image src={icon} width={34} height={34} alt={text} />}
      {!!text && !!icon && (
        <Typography variant="caption" sx={{ fontWeight: "bold", mt: 1 }}>
          {text}
        </Typography>
      )}
      {children}
    </ButtonBase>
  );

  return (
    <Box
      sx={{
        ...(!!fullWidth && {
          flex: 1,
        }),
        "& >a": {
          width: 1 / 1,
          display: "flex",
          color: "text.primary",
          textDecoration: "none",
        },
      }}
    >
      {link ? (
        <Link href={`/${locale}/${link}`}>{buttonContent}</Link>
      ) : (
        buttonContent
      )}
    </Box>
  );
};
