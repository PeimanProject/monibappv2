'use client'; // حتماً این خط باشد

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { initPushNotifications } from './pushService';


export default function PushInit() {
    useEffect(() => {
        // ۱. چک کردن اینکه حتماً در محیط کلاینت و Native هستیم
        if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) {
            initPushNotifications();
        }
    }, []);

    return null; // این کامپوننت چیزی رندر نمی‌کند
}