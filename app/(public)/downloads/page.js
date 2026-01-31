"use client";
import { Box, Container, Divider, Typography, useTheme, IconButton } from "@mui/material";
import Image from "next/image";
import React, { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/app/libs/db"; // آدرس دیتابیس خود را چک کنید
import { Filesystem } from "@capacitor/filesystem";
import { Capacitor } from '@capacitor/core';
import { useRouter } from "next/navigation";

const categories = [
    { id: "last", title: "آخرین دانلود شده ها" },
    { id: "1", title: "تفسیر قرآن کریم" },
    { id: "3", title: "شرح نهج البلاغه" },
    { id: "4", title: "شرح صحیفه سجادیه" },
    { id: "5", title: "گفتارهای ویژه" },
    { id: "wisdom", title: "نکته ها و حکمت ها" }
];

export default function Downloads() {
    const router = useRouter();
    const theme = useTheme();
    const [openId, setOpenId] = React.useState(null);


    // تابع اصلی برای پخش فایل آفلاین
    const handlePlayOffline = (item) => {
        // ۱. تبدیل مسیر محلی گوشی به مسیری که مرورگر اپلیکیشن بفهمد
        const webViewPath = Capacitor.convertFileSrc(item.localPath);

        // ۲. حالا باید این آدرس را به پلیر بفرستید. 
        // بهترین راه استفاده از Query Params یا یک State Manager (مثل Zustand) است.

        // مثال با استفاده از Query Params:
        const playerUrl = `/player?id=${item.lectureId}&source=offline&localUrl=${encodeURIComponent(webViewPath)}&type=${item.type}`;

        router.push(playerUrl);
    };


    // ۱. خواندن تمام دانلودها از Dexie
    const allDownloads = useLiveQuery(() => db.downloads.toArray()) || [];

    // ۲. محاسبه حجم کل به تفکیک نوع
    const stats = useMemo(() => {
        const audioSize = allDownloads
            .filter(d => d.type === 'sound')
            .reduce((acc, curr) => acc + parseFloat(curr.size || 0), 0);

        const videoSize = allDownloads
            .filter(d => d.type === 'video')
            .reduce((acc, curr) => acc + parseFloat(curr.size || 0), 0);

        return { audio: audioSize.toFixed(1), video: videoSize.toFixed(1) };
    }, [allDownloads]);

    const handleChange = (id) => {
        setOpenId(prev => (prev === id ? null : id));
    };

    // ۳. تابع حذف فایل و رکورد دیتابیس
    const handleDelete = async (download) => {
        if (confirm("آیا از حذف این فایل اطمینان دارید؟")) {
            try {
                // حذف فیزیکی فایل از گوشی
                await Filesystem.deleteFile({
                    path: download.localPath
                });
            } catch (e) {
                console.error("فایل فیزیکی یافت نشد یا قبلا حذف شده است");
            }
            // حذف از دیتابیس (حتی اگر فایل فیزیکی نبود، رکورد پاک شود)
            await db.downloads.delete(download.id);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ pt: 2, pb: 30, display: "flex", flexDirection: "column", gap: 2, overflow: "auto" }}>
            <Typography variant="body1" textAlign={"center"} fontWeight={600}>
                گزارش حجم دانلودی شما
            </Typography>

            <Box sx={{ background: theme.palette.primary.main, p: 2, display: "flex", borderRadius: 2 }}>
                <Box sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Typography variant="body2" textAlign={"center"} fontSize={12} color="white">حجم دانلود شده صوتی</Typography>
                    <Typography variant="body1" textAlign={"center"} fontWeight={700} color="white">{stats.audio} مگابایت</Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
                <Box sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Typography variant="body2" textAlign={"center"} fontSize={12} color="white">حجم دانلود شده تصویری</Typography>
                    <Typography variant="body1" textAlign={"center"} fontWeight={700} color="white">{stats.video} مگابایت</Typography>
                </Box>
            </Box>

            {categories.map((category) => {
                // فیلتر کردن آیتم‌های مربوط به این دسته‌بندی
                // نکته: اگر در زمان دانلود categoryId را ذخیره کرده باشید اینجا دقیق‌تر عمل می‌کند
                const categoryItems = allDownloads.filter(d =>
                    category.id === "last" ? true : d.category === category.id
                );

                return (
                    <React.Fragment key={category.id}>
                        <Box
                            onClick={() => handleChange(category.id)}
                            sx={{
                                background: theme.palette.primary.dark,
                                p: 2,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderRadius: 2,
                                cursor: "pointer"
                            }}
                        >
                            <Typography variant="body1" fontWeight={600} color={theme.palette.primary.light}>
                                {category.title}
                            </Typography>
                            <Typography variant="caption" color="white">
                                ({categoryItems.length})
                            </Typography>
                        </Box>

                        {openId === category.id && (
                            <Box sx={{ display: "flex", flexDirection: "column", bgcolor: "background.paper", borderRadius: 2 }}>
                                {categoryItems.length === 0 ? (
                                    <Typography sx={{ p: 2, textAlign: "center", fontSize: 12 }}>موردی دانلود نشده است</Typography>
                                ) : (
                                    categoryItems.map((item) => (
                                        <Box key={item.id}>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
                                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                                    <Typography variant="body1" fontSize={13} fontWeight={600}>{item.fileName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.type === 'sound' ? 'فایل صوتی' : 'فایل تصویری'} | {item.size}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                    <IconButton onClick={() => handleDelete(item)} size="small">
                                                        <Image unoptimized src="/icons/dark/delete.svg" alt="delete" width={20} height={20} />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => handlePlayOffline(item)}>
                                                        <Image unoptimized src="/icons/light/play.svg" alt="play" width={30} height={30} />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <Divider variant="middle" />
                                        </Box>
                                    ))
                                )}
                            </Box>
                        )}
                    </React.Fragment>
                );
            })}
        </Container>
    );
}