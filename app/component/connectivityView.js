"use client";
import { useConnectivity } from "@/core/ConnectivityProvider";
import { Box, Typography, Collapse } from "@mui/material";

export function NetworkStatusBanner() {
    const { isConnected, isInitialized } = useConnectivity();

    // تا زمانی که وضعیت اولیه مشخص نشده چیزی نشان نده
    if (!isInitialized) return null;
    return (
        <Collapse in={!isConnected}>

            <Box sx={{ bgcolor: 'orange', p: 0.5, textAlign: 'center' }}>
                <Typography variant="caption" color="black" fontWeight={700}>
                    شما در حالت آفلاین هستید. محتوا از حافظه گوشی بارگذاری می‌شود.
                </Typography>
            </Box>
        </Collapse>
    );
}