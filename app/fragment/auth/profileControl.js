"use client";

import React from "react";
import { useProfileStore } from "@/store/layout/useProfileStore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  alpha,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useUserStore } from "@/store/useUserStore";
import { useTranslate } from "@/core/useTranslation";

export const ProfileControl = () => {
  const { show, setShow } = useProfileStore((state) => state);
  const { setUser, user } = useUserStore((state) => state);
  const { get } = useTranslate()

  const handleLogout = async () => {
    setUser(null);
    setShow(false);
  };

  return (
    <Dialog
      sx={{
        "& .MuiPaper-root": {
          bgcolor: (theme) => alpha(theme.palette.primary.dark, 0.8),
        },
      }}
      slotProps={{
        backdrop: {
          style: {
            background: "transparent",
          },
        },
      }}
      maxWidth="sm"
      fullWidth
      open={show}
      onClose={() => setShow(false)}
    >
      <DialogTitle
        sx={{
          minHeight: 46,
          display: "flex",
          alignItems: "center",
        }}
        component="div"
      >
        <Typography variant="h6" sx={{ px: 2, color: "white" }}>
          {get("Auth.profile")}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton sx={{ mr: 1 }} onClick={() => setShow(false)}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 1, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
          <TextField
            value={user?.userData?.username || ""}

            slotProps={{
              readOnly: true,
              htmlInput: {
                style: {
                  textAlign: "center",
                },
              },
              input: {
                style: {
                  direction: "ltr",
                },
              },
            }}
          />
          <Button variant="contained" onClick={handleLogout} sx={{ mt: 2 }}>
            {get("Auth.logout")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
