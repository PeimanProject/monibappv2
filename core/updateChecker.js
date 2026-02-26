"use client";
import { useEffect, useState, useCallback } from "react";
import { Box, Button, Typography, Modal, Paper, Stack } from "@mui/material";
import { App } from '@capacitor/app';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate'; // آیکون برای جذابیت

export default function UpdateHandler() {
    const [updateInfo, setUpdateInfo] = useState(null);

    const checkVersion = useCallback(async () => {
        try {
            // ۱. گرفتن اطلاعات نسخه فعلی از دیوایس
            const info = await App.getInfo();
            const currentBuild = parseInt(info.build);

            // ۲. فراخوانی API سرور شما
            const res = await fetch("https://core.monibapp.ir/app/v2/ver");
            const serverData = await res.json();

            // ۳. مقایسه نسخه سرور با نسخه اپلیکیشن
            if (serverData.version > currentBuild) {
                setUpdateInfo({
                    isForce: serverData.forceUpdate,
                    versionName: serverData.displayVersion,
                    url: serverData.downloadUrl || "https://cafebazaar.ir/app/your.id"
                });
            }
        } catch (e) {
            console.error("Update check failed", e);
        }
    }, []);

    useEffect(() => {
        // چک کردن هنگام لود شدن اپ
        checkVersion();

        // چک کردن هر بار که کاربر اپ را دوباره باز می‌کند (Resume)
        const listener = App.addListener('appStateChange', ({ isActive }) => {
            if (isActive) checkVersion();
        });

        return () => listener.then(l => l.remove());
    }, [checkVersion]);

    if (!updateInfo) return null;

    return (
        <Modal
            open={true}
            // اگر اجباری باشد، با کلیک بیرون از مودال بسته نمی‌شود
            onClose={(event, reason) => {
                if (updateInfo.isForce) return;
                setUpdateInfo(null);
            }}
            sx={{ backdropFilter: 'blur(8px)' }} // تار کردن پشت صفحه برای تمرکز بیشتر
        >
            <Box sx={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 3
            }}>
                <Paper sx={{
                    p: 4, width: '100%', maxWidth: 400, textAlign: 'center',
                    borderRadius: '24px', border: updateInfo.isForce ? '2px solid #d32f2f' : 'none'
                }}>
                    <SystemUpdateIcon sx={{ fontSize: 60, color: updateInfo.isForce ? '#d32f2f' : '#1976d2', mb: 2 }} />

                    <Typography variant="h5" fontWeight="900" gutterBottom>
                        {updateInfo.isForce ? "آپدیت اجباری" : "به‌روزرسانی جدید"}
                    </Typography>

                    <Typography sx={{ mb: 4, color: '#555', lineHeight: 1.8 }}>
                        نسخه جدید <b>{updateInfo.versionName}</b> آماده نصب است.
                        {updateInfo.isForce
                            ? " متأسفانه نسخه فعلی شما دیگر پشتیبانی نمی‌شود. برای ادامه استفاده از اپلیکیشن باید آن را به‌روزرسانی کنید."
                            : " پیشنهاد می‌کنیم برای دسترسی به امکانات جدید و رفع خطاهای احتمالی، نسخه جدید را نصب کنید."}
                    </Typography>

                    <Stack spacing={2}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{ borderRadius: '12px', py: 1.5, fontWeight: 'bold' }}
                            onClick={() => window.open(updateInfo.url, "_blank")}
                        >
                            نصب نسخه جدید
                        </Button>

                        {/* دکمه انصراف فقط در صورتی نمایش داده می‌شود که آپدیت اجباری نباشد */}
                        {!updateInfo.isForce && (
                            <Button
                                variant="text"
                                color="inherit"
                                onClick={() => setUpdateInfo(null)}
                            >
                                فعلاً نه، بعداً
                            </Button>
                        )}
                    </Stack>
                </Paper>
            </Box>
        </Modal>
    );
}