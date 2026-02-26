"use client";
import OfflinePage from "@/app/component/offlienPage";
import { useConnectivity } from "@/core/ConnectivityProvider";
import { Typography, CircularProgress, Box, Paper, Avatar, Divider } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import MailOutlineIcon from '@mui/icons-material/MailOutline'; // اگر نصب دارید، در غیر این صورت حذف کنید

export default function Inbox() {
    const { isConnected } = useConnectivity();
    const [list, setList] = useState(undefined);

    const loadMessages = useCallback(async () => {
        try {
            const response = await fetch("https://core.monibapp.ir/app/v2/inbox");
            if (!response.ok) { setList(null); return; }
            const data = await response.json();
            setList(Array.isArray(data) ? data : []);
        } catch (e) {
            setList(null);
        }
    }, []);

    useEffect(() => {
        if (isConnected) loadMessages();
    }, [isConnected, loadMessages]);

    if (!isConnected) return <OfflinePage />;

    if (list === undefined) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress size={30} thickness={5} />
            </Box>
        );
    }

    if (list === null || list.length === 0) {
        return (
            <Box textAlign="center" mt={10} p={3}>
                <MailOutlineIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                <Typography color="textSecondary">پیامی جهت نمایش یافت نشد.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            padding: '20px 16px',
            maxWidth: '600px',
            margin: '0 auto',
        }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 800, color: '#1a1a1a' }}>
                پیام‌ها
            </Typography>

            {list.map((msg) => (
                <Paper
                    key={msg.id}
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: '16px',
                        border: '1px solid #f0f0f0',
                        backgroundColor: msg.isRead ? '#ffffff' : '#f0f7ff', // آبی بسیار ملایم برای خوانده نشده‌ها
                        transition: 'all 0.2s ease-in-out',
                        '&:active': { transform: 'scale(0.98)', backgroundColor: '#f5f5f5' },
                        position: 'relative',
                        display: 'flex',
                        gap: 2
                    }}
                >
                    {/* بخش آواتار یا نشان وضعیت */}
                    <Avatar sx={{
                        bgcolor: msg.isRead ? '#e0e0e0' : '#1976d2',
                        width: 45,
                        height: 45,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                    }}
                        src="/apple-icon.png"

                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}> {/* minWidth: 0 برای کارکرد درست متن‌های طولانی در flex ضروری است */}
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: msg.isRead ? 600 : 800,
                                    color: '#333',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap', // عنوان در یک خط بماند
                                    width: '70%'
                                }}
                            >
                                {msg.title}
                            </Typography>

                            <Typography variant="caption" sx={{ color: '#999', mt: 0.5 }}>
                                {new Date(msg.date).toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }).split(',')[0]}
                            </Typography>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                                color: '#666',
                                mt: 0.5,
                                lineHeight: '1.5',
                                display: '-webkit-box',
                                WebkitLineClamp: 2, // حداکثر ۲ خط نمایش داده شود
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                wordBreak: 'break-word'
                            }}
                        >
                            {msg.content}
                        </Typography>

                        {/* {!msg.isRead && (
                            <Box sx={{
                                position: 'absolute',
                                right: 16,
                                bottom: 16,
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: '#1976d2'
                            }} />
                        )} */}
                    </Box>
                </Paper>
            ))}
        </Box>
    );
}