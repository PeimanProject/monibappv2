import { Box, ButtonBase, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";

export const MenuItem = ({
  title,
  subTitle,
  icon,
  color = "normal",
  center,
  onChange,
  ctrIcon,
}) => {
  return (
    <ButtonBase
      onClick={onChange}
      sx={{
        // border: 2,
        // borderColor: "divider",
        py: 1.2,
        minHeight: 54,
        borderRadius: 4,
        ...(!!!center && { flex: 1, width: 1 / 1 }),
        px: 2,
        bgcolor: "#c7d4ce",
        color: "black",
        justifyContent: !!center ? "center" : "flex-start",
        ...(color === "dark" && {
          bgcolor: "primary.dark",
          color: "white",
        }),
        ...(color === "blue" && {
          bgcolor: "#00006a",
          color: "white",
        }),
      }}
    >
      {!!title && (
        <>
          <Box>
            <Typography variant="body1">{title}</Typography>
            {!!subTitle && (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                ({subTitle})
              </Typography>
            )}{" "}
          </Box>
          <Box sx={{ flex: 1 }} />
        </>
      )}
      {ctrIcon && ctrIcon}
      {icon && (
        <Image alt={title || "Icon"} src={icon} width={34} height={34} />
      )}
    </ButtonBase>
  );
};
