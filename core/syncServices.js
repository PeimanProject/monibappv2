"use client";
import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress, Dialog, DialogContent } from '@mui/material';
import Image from "next/image";
import { db } from "@/app/libs/db";
import { useConnectivity } from './ConnectivityProvider';

export default function InitialSync({ children }) {
    const { isConnected } = useConnectivity();
    const [isSyncing, setIsSyncing] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const checkAndSync = async () => {
            // ۱. چک کردن اینکه آیا دیتابیس خالی است یا نیاز به آپدیت دارد
            const count = await db.lectures.count();
            const lastSync = localStorage.getItem('lastFullSync');

            // اگر دیتابیس خالی بود یا بیش از ۷ روز از آپدیت گذشته بود
            if ((count === 0 || !lastSync) && isConnected) {
                await startSync();
            }
        };

        checkAndSync();
    }, [isConnected]);

    const startSync = async () => {
        setIsSyncing(true);
        setProgress(0);
        try {
            // ۲. فراخوانی API اصلی
            const response = await fetch('https://core.monibapp.ir/app/v2/offline');
            if (!response.ok) throw new Error("Network error");

            const data = await response.json();
            const { series, lectures } = data;
            if (series && series.length > 0) {
                await db.series.bulkPut(series.map(s => ({
                    id: s.id,
                    rowId: s.rowId,
                    title: s.title,
                    displayRow: s.displayRow,
                    lectureId: s.lectureId,
                    lectureCount: s.lectureCount,
                    description: s.description,
                    mainId: s.mainId,
                    type: s.type
                })));
            }
            // ۳. ذخیره مرحله‌ای برای نمایش درصد پیشرفت (شبیه‌سازی شده یا واقعی)
            // در اینجا فرض می‌کنیم دیتا یک آرایه بزرگ است
            if (lectures && lectures.length > 0) {
                const total = lectures.length;
                const batchSize = 100;

                for (let i = 0; i < total; i += batchSize) {
                    const batch = lectures.slice(i, i + batchSize);

                    await db.lectures.bulkPut(batch.map(item => ({
                        id: item.id,
                        row_number: item.row_number,
                        course: item.course,
                        series_id: item.series_id, // کلید اتصال به series
                        main_id: item.main_id,
                        metadata: item.data // اطلاعات تکمیلی مثل زمان‌بندی‌ها
                    })));

                    // به‌روزرسانی درصد پیشرفت
                    setProgress(Math.round(((i + batch.length) / total) * 100));
                }
            }

            localStorage.setItem('lastFullSync', new Date().getTime());
            console.log("Sync completed successfully");
        } catch (error) {
            console.error("Sync failed:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    if (isSyncing) {
        return (
            <Dialog open={isSyncing} fullScreen>
                <DialogContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    background: '#f5f5f5'
                }}>
                    <Image src="/android-icon-192x192.png" alt="Monib Logo" width={120} height={120} priority />

                    <Box sx={{ width: '80%', textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            در حال آماده‌سازی محتوای آفلاین
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            لطفاً تا پایان عملیات شکیبا باشید.
                        </Typography>
                        <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                            {progress}% تکمیل شده
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        );
    }

    return children;
}
