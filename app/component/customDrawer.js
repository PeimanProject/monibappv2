import React from "react";

import { Drawer, styled, alpha, Box, IconButton } from "@mui/material";
import DownIcon from "@mui/icons-material/KeyboardArrowDown";

export const DrawerToolbar = ({ children, showClose = true, onClose }) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        height: 32,
        zIndex: 9,
        borderRadius: (theme) => theme.spacing(4, 4, 0, 0),
        px: 2,
        display: "flex",
        alignItems: "center",
        py: 2,
        bgcolor: "background.paper",
        boxShadow: 2,
      }}
    >
      {children}
      {!!showClose && (
        <IconButton onClick={onClose}>
          <DownIcon />
        </IconButton>
      )}
    </Box>
  );
};

export const CustomDrawer = styled(({ ...props }) => <Drawer {...props} />)(
  ({ theme }) => ({
    "& .MuiBackdrop-root": {
      background: "transparent",
    },
    "& .MuiPaper-root": {
      borderRadius: theme.spacing(4, 4, 0, 0),
      // width: "100%",
      // maxWidth: 700,
      // left: "50%",
      // transform: "translateX(-50%)",
      backgroundColor: alpha(theme.palette.primary.light, 0.95),
      backdropFilter: "blur(8px)",
    },
  })
);
