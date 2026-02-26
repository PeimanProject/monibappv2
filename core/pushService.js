import { db } from '@/app/libs/db';
import { PushNotifications } from '@capacitor/push-notifications';
// دیتابیس Dexie که برای Inbox ساختیم

export const initPushNotifications = async () => {
    // ۱. بررسی و درخواست مجوز (طبق مستندات)
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
        console.warn("کاربر مجوز نوتیفیکیشن را نداد");
        return;
    }

    // ۲. ثبت‌نام در FCM
    await PushNotifications.register();

    // ۳. گوش دادن به رویدادهای حیاتی

    // الف) دریافت توکن (برای ارسال به سرور خودت)
    PushNotifications.addListener('registration', (token) => {
        console.log('FCM Token:', token.value);
        // اینجا باید توکن را به API خودت بفرستی تا سرور بداند به چه کسی پیام بدهد
    });

    // ب) دریافت پیام در حالت باز (Foreground) - مهم برای Inbox
    PushNotifications.addListener('pushNotificationReceived', async (notification) => {
        console.log('Notification Received:', notification);

        // ذخیره خودکار در دیتابیس Dexie برای Inbox
        // await db.inbox.add({
        //     title: notification.title,
        //     body: notification.body,
        //     date: new Date().toISOString(),
        //     isRead: 0,
        //     data: notification.data // اطلاعات اضافی مثل ID درس
        // });
    });

    // این شنونده وقتی اپ بسته است و کاربر روی نوتیف کلیک می‌کند اجرا می‌شود
    PushNotifications.addListener('pushNotificationActionPerformed', async (action) => {
        const notification = action.notification;
        const data = notification.data;

        // ۱. ذخیره پیام در دیتابیس Dexie (چون حالا اپ باز شده و JS کار می‌کند)
        // await db.inbox.add({
        //     title: notification.title,
        //     body: notification.body,
        //     date: new Date().toISOString(),
        //     isRead: 0,
        //     data: data
        // });

        // ۲. هدایت کاربر به صفحه Inbox یا درس مربوطه
        if (data.lectureId) {
            // window.location.href = `/lectures/${data.lectureId}`;
        }
    });
};