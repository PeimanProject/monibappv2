"use client";
import { useEffect } from "react";
import { App as CapApp } from "@capacitor/app";
import { useRouter, usePathname } from "next/navigation";

export default function BackButtonHandler() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handler = CapApp.addListener("backButton", ({ canGoBack }) => {
            if (pathname === "/" || !canGoBack) {
                CapApp.exitApp();
            } else {
                router.back();
            }
        });

        return () => {
            handler.then(h => h.remove());
        };
    }, [pathname, router]);

    return null;
}