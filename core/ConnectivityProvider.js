"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Network } from '@capacitor/network';

// ایجاد Context برای اشتراک‌گذاری وضعیت اینترنت
const ConnectivityContext = createContext({ isConnected: true, isInitialized: false });

export const ConnectivityProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // تابع برای گرفتن وضعیت اولیه
        const getInitialStatus = async () => {
            try {
                const status = await Network.getStatus();
                setIsConnected(status.connected);
            } catch (error) {
                console.error("Could not get network status", error);
            } finally {
                setIsInitialized(true);
            }
        };

        getInitialStatus();

        // گوش دادن به تغییرات شبکه در لحظه
        const handler = Network.addListener('networkStatusChange', (status) => {
            setIsConnected(status.connected);
        });

        // پاکسازی Listener هنگام Unmount شدن
        return () => {
            handler.remove();
        };
    }, []);

    return (
        <ConnectivityContext.Provider value={{ isConnected, isInitialized }}>
            {children}
        </ConnectivityContext.Provider>
    );
};

// هوک اختصاصی برای استفاده آسان در سایر کامپوننت‌ها
export const useConnectivity = () => {
    const context = useContext(ConnectivityContext);
    if (context === undefined) {
        throw new Error('useConnectivity must be used within a ConnectivityProvider');
    }
    return context;
};