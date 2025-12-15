"use client";

import React from "react";
import { useProfileStore } from "@/store/layout/useProfileStore";
import { useTranslations } from "next-intl";
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

export const ProfileControl = () => {
  const { show, setShow } = useProfileStore((state) => state);
  const { setUser, user } = useUserStore((state) => state);
  const t = useTranslations("Auth");

  const handleLogout = async () => {
    await fetch("/api/auth/signout", {
      method: "POST",
    });

    setShow(false);
    setUser(null);
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
          {t("profile")}
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
            {t("logout")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
