"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography, ButtonBase } from "@mui/material";
import { digitsFaToEn } from "@persian-tools/persian-tools";
import { useSpring, animated } from "@react-spring/web";

export const ItemKey = ({ show, children, disabled }) => {
  const springs = useSpring({
    height: show ? 46 : 0,
  });

  return (
    <animated.div
      style={{
        overflow: "hidden",
        // ">a": {
        //   textDecoration: "none",
        // },
        ...springs,
      }}
    >
      <ButtonBase
        disabled={disabled}
        sx={{
          px: 2,
          height: 1 / 1,
          width: 1 / 1,
          position: "relative",
          color: "text.primary",
          borderBottom: 1,
          ...(disabled && { opacity: 0.5 }),
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "primary.dark" : "primary.main",
        }}
      >
        {children}
      </ButtonBase>
    </animated.div>
  );
};

export const SeriesItemKey = ({
  id,
  lectureCount,
  displayRow,
  description,
  locale,
  title,
  lectureId,
  value,
  rowId,
  showRow = true,
  showItem = true,
  type,
  row,
}) => {
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    setShow(
      !!!value ||
      value?.length === 0 ||
      title.indexOf(value) > -1 ||
      rowId === +value ||
      rowId === digitsFaToEn(value)
    );
  }, [value]);

  const content = (
    <ItemKey show={showItem && show} disabled={type === "miskat" && rowId > 18}>
      {!!showRow && (
        <Typography
          variant="body1"
          component={"span"}
          sx={{ mx: 1, fontWeight: "bold" }}
        >
          {displayRow}
        </Typography>
      )}

      <Typography
        sx={{
          flex: 1,
          fontWeight: "bold",
          textAlign: "left",
        }}
      >
        {title}
      </Typography>

      {type !== "miskat" && (
        <>
          <Box sx={{ flexBasis: 60 }} />
          <Typography sx={{ color: "text.primary" }}>{description}</Typography>
        </>
      )}
    </ItemKey>
  );

  if (type === "miskat" && +rowId > 17) {
    return (
      <Box
        sx={{
          flex: row === 12 ? "0 0 100%" : "0 0 50%",
          maxWidth: row === 12 ? "100%" : "50%",
          display: "block",
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Link
      style={{
        flex: row === 12 ? "0 0 100%" : "0 0 50%",
        maxWidth: row === 12 ? "100%" : "50%",
        display: "block",
      }}
      href={
        type === "miskat"
          ? `/quran?surahId=${rowId}&surahName=${title}&type=${type}`
          : `/series?seriesId=${id}&type=${type}`
      }
    >
      {content}
    </Link>
  );
};
