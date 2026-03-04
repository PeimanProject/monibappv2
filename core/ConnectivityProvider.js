// "use client";
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { Network } from '@capacitor/network';

// // ایجاد Context برای اشتراک‌گذاری وضعیت اینترنت
// const ConnectivityContext = createContext({ isConnected: true, isInitialized: false });

// export const ConnectivityProvider = ({ children }) => {
//     const [isConnected, setIsConnected] = useState(true);
//     const [isInitialized, setIsInitialized] = useState(false);

//     useEffect(() => {
//         // تابع برای گرفتن وضعیت اولیه
//         const getInitialStatus = async () => {
//             try {
//                 const status = await Network.getStatus();
//                 setIsConnected(status.connected);
//             } catch (error) {
//                 console.error("Could not get network status", error);
//             } finally {
//                 setIsInitialized(true);
//             }
//         };

//         getInitialStatus();

//         // گوش دادن به تغییرات شبکه در لحظه
//         const handler = Network.addListener('networkStatusChange', (status) => {
//             setIsConnected(status.connected);
//         });

//         // پاکسازی Listener هنگام Unmount شدن
//         return () => {
//             handler.remove();
//         };
//     }, []);

//     return (
//         <ConnectivityContext.Provider value={{ isConnected, isInitialized }}>
//             {children}
//         </ConnectivityContext.Provider>
//     );
// };

// // هوک اختصاصی برای استفاده آسان در سایر کامپوننت‌ها
// export const useConnectivity = () => {
//     const context = useContext(ConnectivityContext);
//     if (context === undefined) {
//         throw new Error('useConnectivity must be used within a ConnectivityProvider');
//     }
//     return context;
// };


"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ConnectivityContext = createContext({
    isConnected: true,
    isInitialized: false,
    isNationalInternetAvailable: true,
    checkNationalConnectivity: async () => { }
});

export const ConnectivityProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isNationalInternetAvailable, setIsNationalInternetAvailable] = useState(true);


    const nationalServers = [
        'https://monibapp.ir',
    ];

    // تابع برای بررسی وضعیت کلی شبکه
    const checkNetworkStatus = useCallback(async () => {
        try {
            const response = await fetch('https://httpbin.org/status/200', {
                method: 'HEAD',
                cache: 'no-store'
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }, []);

    // تابع برای بررسی دسترسی به اینترنت ملی
    const checkNationalConnectivity = useCallback(async () => {
        let reachable = false;

        // بررسی چندین سرور ملی
        for (const serverUrl of nationalServers) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

                const response = await fetch(serverUrl, {
                    method: 'HEAD',
                    mode: 'no-cors',
                    signal: controller.signal,
                    cache: 'no-store'
                });

                clearTimeout(timeoutId);
                reachable = true;
                break;
            } catch (error) {
                console.log('سرور در دسترس نیست:', serverUrl);
            }
        }

        setIsConnected(reachable);
    }, [nationalServers]);

    useEffect(() => {
        let isMounted = true;

        const initializeConnectivity = async () => {
            try {
                // بررسی اولیه اتصال
                // const connected = await checkNetworkStatus();
                if (isMounted) {
                    await checkNationalConnectivity();
                    // setIsConnected(connected);

                    // اگر اتصال کلی وجود دارد، اینترنت ملی را چک کن
                    // if (connected) {
                    // } else {
                    //     setIsNationalInternetAvailable(false);
                    // }
                }
            } catch (error) {
                console.error("خطا در بررسی اتصال:", error);
                if (isMounted) {
                    setIsConnected(false);
                }
            } finally {
                if (isMounted) {
                    setIsInitialized(true);
                }
            }
        };

        initializeConnectivity();

        // بررسی دوره‌ای اتصال (هر 30 ثانیه)
        const intervalId = setInterval(async () => {
            if (isMounted) {
                await checkNationalConnectivity();
                // const connected = await checkNetworkStatus();
                // setIsConnected(connected);

                // if (connected) {
                // } else {
                //     setIsNationalInternetAvailable(false);
                // }
            }
        }, 30000);

        // گوش دادن به تغییرات وضعیت آنلاین/آفلاین مرورگر
        const handleOnline = async () => {
            if (isMounted) {
                setIsConnected(true);
                await checkNationalConnectivity();
            }
        };

        const handleOffline = () => {
            if (isMounted) {
                setIsConnected(false);
                setIsNationalInternetAvailable(false);
            }
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [checkNationalConnectivity]);

    return (
        <ConnectivityContext.Provider value={{
            isConnected,
            isInitialized,
            isNationalInternetAvailable,
            checkNationalConnectivity
        }}>
            {children}
        </ConnectivityContext.Provider>
    );
};

export const useConnectivity = () => {
    const context = useContext(ConnectivityContext);
    if (context === undefined) {
        throw new Error('useConnectivity must be used within a ConnectivityProvider');
    }
    return context;
};
