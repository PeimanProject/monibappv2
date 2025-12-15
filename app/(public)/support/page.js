"use client";

import {
  Grid,
  Container,
  Button,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Radio,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { digitsEnToFa } from "@persian-tools/persian-tools";

const BootstrapInputMessage = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: 5,
    position: "relative",
    backgroundColor: "#F3F6F9",
    border: "1px solid",
    borderColor: "#000",
    fontSize: 16,

    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    // Use the system font instead of the default Roboto font.

    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
      borderColor: "#2D3843",
    }),
  },
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 5,
    position: "relative",
    backgroundColor: "#F3F6F9",
    border: "1px solid",
    borderColor: "#000",
    fontSize: 16,

    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    // Use the system font instead of the default Roboto font.

    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
      borderColor: "#2D3843",
    }),
  },
}));

export default function SupportPage() {
  const [message, setMessage] = useState({
    message: "",
    name: "",
    phone: "",
    email: "",
    whatsapp: "",
  });
  const [preferredContact, setPreferredContact] = useState("phone");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Validation functions
  const validateIranianMobile = (phone) => {
    return true;
    const mobileRegex = /^09[0-9]{9}$/;
    return mobileRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateWhatsApp = (whatsapp) => {
    // WhatsApp numbers can be in various formats, but should be numeric
    const whatsappRegex = /^[0-9]{10,15}$/;
    return whatsappRegex.test(whatsapp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!message.message.trim() || !message.name.trim()) {
      setSnackbar({
        open: true,
        message: "لطفا پیام و نام خود را وارد کنید",
        severity: "error",
      });
      return;
    }

    // Validate at least one contact method is filled
    if (!message.phone && !message.email && !message.whatsapp) {
      setSnackbar({
        open: true,
        message: "لطفا حداقل یک روش ارتباطی را وارد کنید",
        severity: "error",
      });
      return;
    }

    // Validate the preferred contact method is filled
    if (!message[preferredContact]) {
      setSnackbar({
        open: true,
        message: `لطفا ${
          preferredContact === "phone"
            ? "شماره موبایل"
            : preferredContact === "email"
            ? "ایمیل"
            : "شماره واتس‌اپ"
        } را وارد کنید`,
        severity: "error",
      });
      return;
    }

    // Validate phone number if provided
    if (message.phone && !validateIranianMobile(message.phone)) {
      setSnackbar({
        open: true,
        message: "شماره موبایل وارد شده صحیح نیست",
        severity: "error",
      });
      return;
    }

    // Validate email if provided
    if (message.email && !validateEmail(message.email)) {
      setSnackbar({
        open: true,
        message: "آدرس ایمیل وارد شده صحیح نیست",
        severity: "error",
      });
      return;
    }

    // Validate WhatsApp if provided
    if (message.whatsapp && !validateWhatsApp(message.whatsapp)) {
      setSnackbar({
        open: true,
        message: "شماره واتس‌اپ وارد شده صحیح نیست",
        severity: "error",
      });
      return;
    }

    // Show success message
    setSnackbar({
      open: true,
      message: "پیام شما با موفقیت ارسال شد",
      severity: "success",
    });

    fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({ data: message }),
    });

    // Reset form
    setMessage({
      message: "",
      name: "",
      phone: "",
      email: "",
      whatsapp: "",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ pt: { xs: 1, md: 4 }, pb: 22, px: 4 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl variant="standard" fullWidth>
              <BootstrapInputMessage
                placeholder="متن پیام..."
                fullWidth
                multiline
                rows={8}
                value={message.message}
                onChange={(e) =>
                  setMessage({ ...message, message: e.target.value })
                }
              />
            </FormControl>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            size={{ xs: 12, md: 6 }}
          >
            <FormControl fullWidth variant="standard">
              <InputLabel shrink htmlFor="bootstrap-input">
                <Typography variant="h6">نام و نام خانوادگی</Typography>
              </InputLabel>
              <BootstrapInput
                label="نام و نام خانوادگی"
                value={message.name}
                onChange={(e) =>
                  setMessage({ ...message, name: e.target.value })
                }
              />
            </FormControl>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                width: "100%",
              }}
            >
              <Grid container>
                <Grid
                  size={2}
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  <FormControlLabel
                    value="phone"
                    control={
                      <Radio
                        checked={preferredContact === "phone"}
                        onChange={(e) => {
                          setPreferredContact(e.target.value);
                          if (!message.phone) {
                            setMessage({ ...message, phone: "" });
                          }
                        }}
                      />
                    }
                    label=""
                  />
                </Grid>
                <Grid size={10}>
                  <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
                    <InputLabel shrink htmlFor="bootstrap-input">
                      <Typography variant="h6">موبایل</Typography>
                    </InputLabel>
                    <BootstrapInput
                      value={message.phone}
                      onChange={(e) =>
                        setMessage({ ...message, phone: e.target.value })
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container>
                <Grid
                  size={2}
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  <FormControlLabel
                    value="email"
                    control={
                      <Radio
                        checked={preferredContact === "email"}
                        onChange={(e) => {
                          setPreferredContact(e.target.value);
                          if (!message.email) {
                            setMessage({ ...message, email: "" });
                          }
                        }}
                      />
                    }
                    label=""
                  />
                </Grid>
                <Grid size={10}>
                  <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
                    <InputLabel shrink htmlFor="bootstrap-input">
                      <Typography variant="h6">ایمیل</Typography>
                    </InputLabel>
                    <BootstrapInput
                      value={message.email}
                      size="small"
                      onChange={(e) =>
                        setMessage({ ...message, email: e.target.value })
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container>
                <Grid
                  size={2}
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  <FormControlLabel
                    value="whatsapp"
                    control={
                      <Radio
                        checked={preferredContact === "whatsapp"}
                        onChange={(e) => {
                          setPreferredContact(e.target.value);
                          if (!message.whatsapp) {
                            setMessage({ ...message, whatsapp: "" });
                          }
                        }}
                      />
                    }
                    label=""
                  />
                </Grid>
                <Grid size={10}>
                  <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
                    <InputLabel shrink htmlFor="bootstrap-input">
                      <Typography variant="h6">واتس آپ</Typography>
                    </InputLabel>
                    <BootstrapInput
                      value={message.whatsapp}
                      onChange={(e) =>
                        setMessage({ ...message, whatsapp: e.target.value })
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            <Button
              type="submit"
              disableElevation
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                bgcolor: "black",
                color: "white",
                width: 140,
                display: "block",
              }}
            >
              ارسال
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
