"use client";
import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import SignalWifiConnectedNoInternet4Icon from "@mui/icons-material/SignalWifiConnectedNoInternet4";
import { motion } from "framer-motion";

const OfflinePage = ({ onRetry }) => {
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    textAlign: "center",
                    p: 3,
                }}
            >
                {/* انیمیشن لوگو و آیکون */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                >
                    <Box sx={{ position: "relative", mb: 4 }}>
                        {/* لوگوی شرکت - مسیر را جایگزین کنید */}
                        <Box
                            component="img"
                            src="/assets/images/logo.png"
                            alt="Logo"
                            sx={{
                                width: 100,
                                height: "auto",
                                mb: 2,
                                filter: "grayscale(100%)",
                                opacity: 0.8,
                            }}
                            onError={(e) => (e.target.style.display = "none")}
                        />
                        <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <SignalWifiConnectedNoInternet4Icon
                                sx={{ fontSize: 80, color: "text.disabled" }}
                            />
                        </motion.div>
                    </Box>
                </motion.div>

                {/* بخش متون با انیمیشن ظهور از پایین */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <Typography variant="h5" fontWeight="800" gutterBottom color="text.primary">
                        عدم دسترسی به شبکه
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 5, lineHeight: 1.8 }}>
                        در حال حاضر اتصال شما به اینترنت برقرار نیست. برای استفاده از تمامی امکانات و دریافت محتوای جدید، لطفاً وضعیت شبکه خود را بررسی کنید.
                        <br />
                        شما همچنان می‌توانید از بخش‌های دانلود شده به صورت آفلاین استفاده نمایید.
                    </Typography>
                </motion.div>

                {/* دکمه‌ها با انیمیشن هاور */}
                {/* <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={onRetry || (() => window.location.reload())}
                                sx={{
                                    borderRadius: 3,
                                    px: 8,
                                    py: 1.5,
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                                }}
                            >
                                تلاش مجدد
                            </Button>
                        </motion.div>

                        <Button
                            variant="text"
                            color="primary"
                            sx={{ fontWeight: "bold" }}
                        // onClick={() => router.push('/downloads')}
                        >
                            ورود به بخش آفلاین
                        </Button>
                    </Box>
                </motion.div> */}
            </Box>
        </Container>
    );
};

export default OfflinePage;