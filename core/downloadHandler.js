import { FileTransfer } from '@capacitor/file-transfer';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { db } from "@/app/libs/db";

/**
 * مدیریت کامل دانلود رسانه و ذخیره وضعیت در دیتابیس
 * @param {Object} params - پارامترهای دانلود
 * @param {number|string} params.lectureId - شناسه درس
 * @param {'sound' | 'video'} params.type - نوع رسانه
 * @param {string} params.url - لینک دانلود (از بخش download در JSON)
 * @param {string} params.displaySize - حجم فایل برای ذخیره در دیتابیس (مثلا 115.71 MB)
 * @param {Function} params.onProgress - کالبک برای آپدیت درصد پیشرفت در UI
 */
export const downloadMediaHandler = async ({ lectureId, mainId, type, url, displaySize, onProgress }) => {
    const extension = type === 'video' ? 'mp4' : 'mp3';
    const fileName = `lecture-${lectureId}-${type}.${extension}`;
    const relativePath = `media/${fileName}`;

    let progressListener = null;

    try {
        // ۱. ایجاد پوشه media اگر وجود نداشته باشد
        try {
            await Filesystem.mkdir({
                path: 'media',
                directory: Directory.Data,
                recursive: true,
            });
        } catch (e) {
            // پوشه از قبل وجود دارد
        }

        // ۲. تنظیم شنونده (Listener) برای درصد پیشرفت
        progressListener = await FileTransfer.addListener('progress', (progress) => {
            if (onProgress && progress.contentLength > 0) {
                const percentage = Math.round((progress.bytes / progress.contentLength) * 100);
                onProgress(percentage);
            }
        });

        // ۳. گرفتن مسیر نهایی فایل در سیستم عامل
        const fileUri = await Filesystem.getUri({
            directory: Directory.Data,
            path: relativePath,
        });

        // ۴. شروع عملیات دانلود
        // در Capacitor 8، خروجی این تابع مستقیماً Promise است
        await FileTransfer.downloadFile({
            url: url,
            path: fileUri.uri,
            progress: true,
        });

        // ۵. ذخیره اطلاعات در Dexie بعد از موفقیت دانلود
        await db.downloads.put({
            id: `${lectureId}-${type}`, // کلید یکتا برای هر نوع رسانه در هر درس
            lectureId: lectureId,
            fileName: fileName,
            type: type,
            categoryId: mainId,
            localPath: fileUri.uri, // مسیری که بعدا برای پخش آفلاین استفاده می‌کنید
            status: 'completed',
            size: displaySize || 'Unknown',
            createdAt: new Date().toISOString(),
        });

        return fileUri.uri;

    } catch (error) {
        console.error("Download Error:", error);
        throw error;
    } finally {
        // ۶. پاکسازی Listener برای جلوگیری از نشت حافظه (Memory Leak)
        if (progressListener) {
            progressListener.remove();
        }
    }
};